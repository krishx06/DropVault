import type { Drop } from './drop.types'

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'

export interface Order {
  id: string
  userId: string
  dropId: string
  quantity: number
  totalAmount: number
  status: OrderStatus
  createdAt: string
  updatedAt: string
  drop?: Drop
}
