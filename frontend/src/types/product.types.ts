export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED'

export interface Product {
  id: string
  sellerId: string
  name: string
  description: string
  price: number
  imageUrl: string | null
  status: ProductStatus
  isApproved: boolean
  createdAt: string
  updatedAt: string
}
