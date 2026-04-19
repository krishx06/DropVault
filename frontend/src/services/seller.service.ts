import api from './api'
import type { Seller } from '../types/seller.types'
import type { Drop } from '../types/drop.types'

interface SellerResponse {
  success: boolean
  data: Seller
}

interface DropsResponse {
  success: boolean
  data: Drop[]
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
