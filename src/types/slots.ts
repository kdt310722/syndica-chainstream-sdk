import type { NotificationMessageParams } from './common'

export interface SlotContext {
    nodeTime: string
}

export interface Slot {
    slot: number
    parent: number | null
    status: string
}

export type SlotNotificationMessageParams = NotificationMessageParams<SlotContext, Slot>
