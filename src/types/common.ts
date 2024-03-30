import type { AnyObject } from '@kdt310722/eslint-config'

export interface SubscriptionParams {
    network?: 'solana-mainnet'
    verified?: boolean
}

export interface NotificationMessageResult<C extends AnyObject, V extends AnyObject> {
    context: C
    value: V
}

export interface NotificationMessageParams<C extends AnyObject, V extends AnyObject> {
    subscription: number
    result: NotificationMessageResult<C, V>
}
