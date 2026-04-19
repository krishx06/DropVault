import api from './api'
import type { Review } from '../types/review.types'

interface ReviewsResponse {
  success: boolean
  data: Review[]
}

interface ReviewResponse {
  success: boolean
  data: Review
}

export const getReviewsByProduct = (productId: string) =>
  api.get<ReviewsResponse>(`/reviews/product/${productId}`)

export const getMyReviews = () =>
  api.get<ReviewsResponse>('/reviews/me')

export const submitReview = (productId: string, rating: number, comment?: string) =>
  api.post<ReviewResponse>('/reviews', { productId, rating, comment })
