import api from './api'
import type { Order } from '../types/order.types'

interface OrderResponse {
  success: boolean
  data: Order
}

interface OrdersResponse {
  success: boolean
  data: Order[]
}

export const getMyOrders = () =>
  api.get<OrdersResponse>('/orders/me')

export const createOrder = (dropId: string, quantity = 1) =>
  api.post<OrderResponse>('/orders', { dropId, quantity })

export const cancelOrder = (id: string) =>
  api.patch<OrderResponse>(`/orders/${id}/cancel`)
