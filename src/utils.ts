import { isKeysOf, isObject } from '@kdt310722/utils/object'
import { Message, MessageV0, PublicKey, type TransactionResponse, type TransactionVersion } from '@solana/web3.js'
import bs58 from 'bs58'
import type { MessageResponse, NotificationMessageParams } from './types'

export function isNotificationMessageParams(params: unknown): params is NotificationMessageParams<any, any> {
    return isObject(params) && isKeysOf(params, ['subscription', 'result']) && isObject(params.result) && isKeysOf(params.result, ['context', 'value'])
}

export function versionedMessageFromResponse(version: TransactionVersion | undefined, response: MessageResponse) {
    const message = {
        ...response,
        addressTableLookups: response.addressTableLookups?.map((i) => ({ ...i, accountKey: new PublicKey(i.accountKey) })),
    }

    if (version === 0) {
        return new MessageV0({
            header: message.header,
            staticAccountKeys: message.accountKeys.map((i) => new PublicKey(i)),
            recentBlockhash: message.recentBlockhash,
            compiledInstructions: message.instructions.map((ix) => ({
                programIdIndex: ix.programIdIndex,
                accountKeyIndexes: ix.accounts,
                data: bs58.decode(ix.data),
            })),
            addressTableLookups: message.addressTableLookups!,
        })
    }

    return new Message(message)
}

export const formatTransaction = (result: any) => (<TransactionResponse>{
    ...result,
    transaction: { ...result.transaction, message: versionedMessageFromResponse(result.version, result.transaction.message) },
})
