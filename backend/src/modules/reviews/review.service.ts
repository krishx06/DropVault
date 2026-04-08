import { Review } from '@prisma/client';
import prisma from '../../config/db';
import { PrismaReviewRepository } from '../../repositories/prisma/PrismaReviewRepository';
import { PrismaProductRepository } from '../../repositories/prisma/PrismaProductRepository';
import { CreateReviewInput } from './review.types';
import { ReviewWithUser } from '../../repositories/interfaces/IReviewRepository';
import { BadRequestError, NotFoundError, ConflictError } from '../../utils/AppError';
import { logger } from '../../utils/logger';

const reviewRepository = new PrismaReviewRepository();
const productRepository = new PrismaProductRepository();

export async function submitReview(
  userId: string,
  input: CreateReviewInput,
): Promise<Review> {
  const { productId, rating, comment } = input;

  if (!rating || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    throw BadRequestError('Rating must be an integer between 1 and 5');
  }

  const product = await productRepository.findById(productId);
  if (!product) {
    throw NotFoundError('Product not found');
  }

  const purchase = await prisma.order.findFirst({
    where: {
      userId,
      status: { in: ['PENDING', 'CONFIRMED'] },
      drop: { productId },
    },
  });
  if (!purchase) {
    throw BadRequestError('You can only review products you have purchased');
  }

  const existing = await reviewRepository.findByUserAndProduct(userId, productId);
  if (existing) {
    throw ConflictError('You have already reviewed this product');
  }

  const review = await reviewRepository.create({ userId, productId, rating, comment });
  logger.info(`Review submitted: user=${userId}, product=${productId}`);
  return review;
}

export async function getProductReviews(productId: string): Promise<ReviewWithUser[]> {
  return reviewRepository.findApprovedByProductId(productId);
}

export async function getMyReviews(userId: string): Promise<Review[]> {
  return reviewRepository.findByUserId(userId);
}

export async function moderateReview(
  reviewId: string,
  status: string,
): Promise<Review> {
  if (!['APPROVED', 'REJECTED'].includes(status)) {
    throw BadRequestError('Status must be APPROVED or REJECTED');
  }

  const review = await reviewRepository.findById(reviewId);
  if (!review) {
    throw NotFoundError('Review not found');
  }

  if (review.status !== 'PENDING') {
    throw BadRequestError('Only pending reviews can be moderated');
  }

  const updated = await reviewRepository.updateStatus(
    reviewId,
    status as 'APPROVED' | 'REJECTED',
  );
  logger.info(`Review ${status.toLowerCase()}: reviewId=${reviewId}`);
  return updated;
}
