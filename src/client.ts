import { type RpcClientEvents, RpcWebSocketClient, type RpcWebSocketClientOptions } from '@kdt310722/rpc'
import { Emitter } from '@kdt310722/utils/event'
import { isWebSocketUrl } from '@kdt310722/utils/string'
import { BASE_URL } from './constants'
import type { Block, BlockContext, Slot, SlotContext, SubscriptionParams, Transaction, TransactionContext, TransactionSubscriptionParams } from './types'
import { formatTransaction, isNotificationMessageParams } from './utils'

export type SyndicaChainStreamEvents = RpcClientEvents & {
    transaction: (transaction: Transaction, context: TransactionContext) => void
    block: (block: Block, context: BlockContext) => void
    slot: (slot: Slot, context: SlotContext) => void
}

export interface SyndicaChainStreamOptions extends RpcWebSocketClientOptions {
    autoResubscribe?: boolean
}

export class SyndicaChainStream extends Emitter<SyndicaChainStreamEvents> {
    protected readonly url: string
    protected readonly client: RpcWebSocketClient
    protected readonly subscriptions: Map<number, () => Promise<any>>
    protected readonly autoResubscribe: boolean

    public constructor(apiKeyOrRpcUrl: string, { autoResubscribe = true, ...options }: SyndicaChainStreamOptions = {}) {
        super()

        this.url = isWebSocketUrl(apiKeyOrRpcUrl) ? apiKeyOrRpcUrl : new URL(`/api-token/${apiKeyOrRpcUrl}/`, BASE_URL).href
        this.client = this.registerClientEvents(new RpcWebSocketClient(this.url, options))
        this.subscriptions = new Map()
        this.autoResubscribe = autoResubscribe
    }

    public async connect() {
        await this.client.connect()
    }

    public disconnect(code?: number, reason?: string) {
        this.client.disconnect(code, reason)
        this.subscriptions.clear()
    }

    public async subscribeTransaction(params: TransactionSubscriptionParams = {}) {
        return this.subscribe('chainstream.transactionsSubscribe', { network: 'solana-mainnet', verified: false, filter: {}, ...params }, 'chainstream.transactionsUnsubscribe')
    }

    public async subscribeBlock(params: SubscriptionParams = {}) {
        return this.subscribe('chainstream.blocksSubscribe', { network: 'solana-mainnet', verified: false, ...params }, 'chainstream.blocksUnsubscribe')
    }

    public async subscribeSlot(params: SubscriptionParams = {}) {
        return this.subscribe('chainstream.slotUpdatesSubscribe', { network: 'solana-mainnet', verified: false, ...params }, 'chainstream.slotUpdatesUnsubscribe')
    }

    public async subscribe(subscribeMethod: string, params: any, unsubscribeMethod: string) {
        let unsubscribe: () => Promise<void>

        const subscription = await this.client.call<number>(subscribeMethod, params).then((id) => {
            this.subscriptions.set(id, async () => {
                unsubscribe = await this.subscribe(subscribeMethod, params, unsubscribeMethod)
            })

            return id
        })

        unsubscribe = async () => {
            await this.client.call(unsubscribeMethod, [subscription]).then(() => {
                this.subscriptions.delete(subscription)
            })
        }

        return unsubscribe
    }

    protected registerClientEvents(client: RpcWebSocketClient) {
        const notifyEvents = {
            blockNotification: 'block',
            slotUpdateNotification: 'slot',
        }

        client.on('notify', (method, params) => {
            if (isNotificationMessageParams(params)) {
                if (method === 'transactionNotification') {
                    return this.emit('transaction', formatTransaction(params.result.value), params.result.context)
                }

                if (method in notifyEvents) {
                    return this.emit(notifyEvents[method], params.result.value, params.result.context)
                }
            }

            return this.emit('unknown-message', JSON.stringify({ method, params }))
        })

        client.on('open', async () => {
            this.emit('open')

            if (this.autoResubscribe) {
                for (const [id, subscribe] of this.subscriptions) {
                    await subscribe().catch((error) => {
                        throw new Error(`Unable to resubscribe to subscription ${id}`, { cause: error })
                    })
                }
            }
        })

        client.on('reconnect-failed', () => {
            this.subscriptions.clear()
            this.emit('reconnect-failed')
        })

        for (const event of ['close', 'reconnect', 'error', 'unknown-message', 'rpc-error']) {
            client.on(event, (...args: any) => this.emit(event, ...args))
        }

        return client
    }
}
