import type { CompiledInstruction, MessageHeader, TransactionResponse, VersionedTransactionResponse } from '@solana/web3.js'
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

export interface TransactionSubscriptionParams extends SubscriptionParams {
    filter?: TransactionFilter
}

export type Transaction = TransactionResponse | VersionedTransactionResponse

export type AddressTableLookup = {
    accountKey: string
    writableIndexes: number[]
    readonlyIndexes: number[]
}

export type MessageResponse = {
    accountKeys: string[]
    header: MessageHeader
    instructions: CompiledInstruction[]
    recentBlockhash: string
    addressTableLookups?: AddressTableLookup[]
}

export type TransactionNotificationMessageParams = NotificationMessageParams<TransactionContext, Transaction>
