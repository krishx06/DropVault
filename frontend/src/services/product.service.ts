import api from './api'
import type { Product } from '../types/product.types'

interface ProductResponse {
  success: boolean
  data: Product
}

interface ProductsResponse {
  success: boolean
  data: Product[]
}

export const getMyProducts = () =>
  api.get<ProductsResponse>('/products/me')

export const createProduct = (data: {
  name: string
  description: string
  price: number
  imageUrl?: string
}) => api.post<ProductResponse>('/products', data)

export const updateProduct = (id: string, data: {
  name?: string
  description?: string
  price?: number
  imageUrl?: string
}) => api.patch<ProductResponse>(`/products/${id}`, data)
