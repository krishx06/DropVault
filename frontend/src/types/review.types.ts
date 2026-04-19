export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface Review {
  id: string
  userId: string
  productId: string
  rating: number
  comment: string | null
  status: ReviewStatus
  createdAt: string
  user?: { name: string }
}
