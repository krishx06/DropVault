export type ProductStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface Product {
  id: string
  sellerId: string
  name: string
  description: string
  price: number
  imageUrl: string | null
  status: ProductStatus
  createdAt: string
  updatedAt: string
}
