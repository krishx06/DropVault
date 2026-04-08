import { Review, ReviewStatus } from '@prisma/client';

export interface ReviewWithUser extends Review {
  user: { id: string; name: string };
}

export interface CreateReviewData {
  userId: string;
  productId: string;
  rating: number;
  comment?: string;
}

export interface IReviewRepository {
  create(data: CreateReviewData): Promise<Review>;
  findById(id: string): Promise<Review | null>;
  findApprovedByProductId(productId: string): Promise<ReviewWithUser[]>;
  findByUserId(userId: string): Promise<Review[]>;
  findByUserAndProduct(userId: string, productId: string): Promise<Review | null>;
  findPending(): Promise<ReviewWithUser[]>;
  updateStatus(id: string, status: ReviewStatus): Promise<Review>;
}
