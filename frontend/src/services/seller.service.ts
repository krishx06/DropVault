import api from './api'
import type { Seller } from '../types/seller.types'
import type { Drop } from '../types/drop.types'
import type { OrderStatus } from '../types/order.types'

interface SellerResponse {
  success: boolean
  data: Seller
}

interface DropsResponse {
  success: boolean
  data: Drop[]
}

export interface SellerOrder {
  id: string
  userId: string
  dropId: string
  quantity: number
  totalAmount: number
  status: OrderStatus
  createdAt: string
  updatedAt: string
  drop: Drop & { product: { name: string; imageUrl: string | null; price: number } }
  user: { id: string; name: string; email: string }
}


export const getSellerProfile = () =>
  api.get<SellerResponse>('/sellers/me')

export const getMyDrops = () =>
  api.get<DropsResponse>('/drops/me')

export const createDrop = (data: {
  productId: string
  startTime: string
  endTime: string
  stock: number
}) => api.post<{ success: boolean; data: Drop }>('/drops', data)

export const updateDrop = (id: string, data: {
  startTime?: string
  endTime?: string
  stock?: number
}) => api.patch<{ success: boolean; data: Drop }>(`/drops/${id}`, data)

export interface PublicSeller {
  id: string
  user: { name: string }
  _count: { products: number }
}

export const getPublicSellers = () =>
  api.get<{ success: boolean; data: PublicSeller[] }>('/sellers')

export const getSellerOrders = () =>
  api.get<{ success: boolean; data: SellerOrder[] }>('/sellers/orders')

export const confirmSellerOrder = (id: string) =>
  api.patch<{ success: boolean; data: SellerOrder }>(`/sellers/orders/${id}/confirm`)
