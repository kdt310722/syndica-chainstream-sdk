import { isKeysOf, isObject } from '@kdt310722/utils/object'
import type { NotificationMessageParams } from './types'

export function isNotificationMessageParams(params: unknown): params is NotificationMessageParams<any, any> {
    return isObject(params) && isKeysOf(params, ['subscription', 'result']) && isObject(params.result) && isKeysOf(params.result, ['context', 'value'])
}
