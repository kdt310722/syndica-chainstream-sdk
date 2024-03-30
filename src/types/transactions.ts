import type { AnyObject } from '@kdt310722/eslint-config'
import type { Reward } from './blocks'
import type { NotificationMessageParams, SubscriptionParams } from './common'

export interface AccountKeysFilter {
    all?: string[]
    oneOf?: string[]
    exclude?: string[]
}

export interface TransactionFilter {
    excludeVotes?: boolean
    accountKeys?: AccountKeysFilter
}

export interface TransactionContext {
    index: number
    isVote: boolean
    nodeTime: string
    signature: string
    slotStatus: string
}

export type TransactionError = AnyObject | string

export interface TransactionInstruction {
    programIdIndex: number
    accounts: number[]
    data: string
}

export interface InnerInstruction {
    index: number
    instructions: TransactionInstruction[]
}

export interface LoadedAddresses {
    'readonly': string[]
    'writable': string[]
}

export interface TokenAmount {
    amount: string
    decimals: number
    uiAmount?: number | null
    uiAmountString?: string
}

export interface TokenBalance {
    accountIndex: number
    mint: string
    owner?: string
    uiTokenAmount: TokenAmount
}

export interface TransactionMeta {
    err?: TransactionError | null
    fee: number
    innerInstructions?: InnerInstruction[] | null
    loadedAddresses?: LoadedAddresses | null
    preBalances: number[]
    postBalances: number[]
    preTokenBalances?: TokenBalance[] | null
    postTokenBalances?: TokenBalance[] | null
    logMessages?: string[] | null
    rewards?: Reward[] | null
    computeUnitsConsumed?: number | null
}

export type TransactionVersion = 'legacy' | 0

export interface AddressTableLookup {
    accountKey: string
    writableIndexes: number[]
    readonlyIndexes: number[]
}

export interface TransactionMessage {
    accountKeys: string[]
    addressTableLookups?: AddressTableLookup[] | null
    header: AnyObject
    instructions: TransactionInstruction[]
    recentBlockhash: string
}

export interface Transaction {
    signatures: string[]
    messageHash: string
    message: TransactionMessage
}

export interface TransactionWithMeta {
    blockTime: number | null
    slot: number
    version?: TransactionVersion | null
    meta?: TransactionMeta | null
    transaction: Transaction
}

export interface TransactionSubscriptionParams extends SubscriptionParams {
    filter?: TransactionFilter
}

export type TransactionNotificationMessageParams = NotificationMessageParams<TransactionContext, TransactionWithMeta>
