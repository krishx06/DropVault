export type SellerStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface Seller {
  id: string
  userId: string
  status: SellerStatus
  createdAt: string
  user?: {
    id: string
    name: string
    email: string
  }
}
