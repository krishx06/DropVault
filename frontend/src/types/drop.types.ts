export type DropStatus = 'UPCOMING' | 'LIVE' | 'ENDED' | 'SOLD_OUT'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string | null
  sellerId: string
}

export interface Drop {
  id: string
  productId: string
  startTime: string
  endTime: string
  stock: number
  sold: number
  status: DropStatus
  product: Product
  createdAt: string
  updatedAt: string
}
