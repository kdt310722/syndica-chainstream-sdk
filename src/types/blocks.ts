import type { NotificationMessageParams } from './common'

export interface BlockContext {
    nodeTime: string
}

export interface Reward {
    pubkey: string
    lamports: number
    postBalance: number
    rewardType: string
    commission?: number | null
}

export interface Block {
    slot: number
    blockhash: string
    rewards: Reward[]
    blockTime: string
    blockHeight: number
    parentSlot: number
    parentBlockhash: string
    excludedTransactionCount: number
}

export type BlockNotificationMessageParams = NotificationMessageParams<BlockContext, Block>
