import type { BlockResponse } from '@solana/web3.js'
import type { NotificationMessageParams } from './common'

export interface BlockContext {
    nodeTime: string
}

export interface Block extends Omit<BlockResponse, 'transactions' | 'previousBlockhash'> {
    blockHeight: number
    excludedTransactionCount: number
}

export type BlockNotificationMessageParams = NotificationMessageParams<BlockContext, Block>
