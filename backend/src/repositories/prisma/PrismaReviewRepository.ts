import prisma from '../../config/db';
import { Review, ReviewStatus } from '@prisma/client';
import { IReviewRepository, ReviewWithUser, CreateReviewData } from '../interfaces/IReviewRepository';

export class PrismaReviewRepository implements IReviewRepository {
  async create(data: CreateReviewData): Promise<Review> {
    return prisma.review.create({ data });
  }

  async findById(id: string): Promise<Review | null> {
    return prisma.review.findUnique({ where: { id } });
  }

  async findApprovedByProductId(productId: string): Promise<ReviewWithUser[]> {
    return prisma.review.findMany({
      where: { productId, status: 'APPROVED' },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUserId(userId: string): Promise<Review[]> {
    return prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUserAndProduct(userId: string, productId: string): Promise<Review | null> {
    return prisma.review.findFirst({ where: { userId, productId } });
  }

  async findPending(): Promise<ReviewWithUser[]> {
    return prisma.review.findMany({
      where: { status: 'PENDING' },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async updateStatus(id: string, status: ReviewStatus): Promise<Review> {
    return prisma.review.update({ where: { id }, data: { status } });
  }
}
