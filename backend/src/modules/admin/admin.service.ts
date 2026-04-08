import { PrismaSellerRepository } from '../../repositories/prisma/PrismaSellerRepository';
import { PrismaUserRepository } from '../../repositories/prisma/PrismaUserRepository';
import { BadRequestError, NotFoundError } from '../../utils/AppError';
import { UpdateSellerStatusInput } from './admin.types';
import { SellerWithUser } from '../../repositories/interfaces/ISellerRepository';
import { SafeUser } from '../../repositories/interfaces/IUserRepository';
import { logger } from '../../utils/logger';

const sellerRepository = new PrismaSellerRepository();
const userRepository = new PrismaUserRepository();

export async function getPendingSellers(): Promise<SellerWithUser[]> {
  return sellerRepository.findByStatus('PENDING');
}

export async function getAllSellers(): Promise<SellerWithUser[]> {
  return sellerRepository.findAll();
}


export async function updateSellerStatus(
  input: UpdateSellerStatusInput,
): Promise<SellerWithUser> {
  const { sellerId, status } = input;

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    throw BadRequestError('Status must be APPROVED or REJECTED');
  }

  const seller = await sellerRepository.findById(sellerId);
  if (!seller) {
    throw NotFoundError('Seller not found');
  }
  if (seller.status !== 'PENDING') {
    throw BadRequestError(
      `Seller is already ${seller.status.toLowerCase()}. Only pending sellers can be updated.`,
    );
  }

  await sellerRepository.updateStatus(sellerId, status);

  logger.info(`Seller ${status.toLowerCase()}`, {
    sellerId,
    userId: seller.userId,
    email: seller.user.email,
  });

  const updatedSeller = await sellerRepository.findById(sellerId);
  return updatedSeller!;
}

export async function getAllUsers(): Promise<SafeUser[]> {
  return userRepository.findAll();
}

export async function getPendingReviews() {
  const { PrismaReviewRepository } = await import('../../repositories/prisma/PrismaReviewRepository');
  const reviewRepository = new PrismaReviewRepository();
  return reviewRepository.findPending();
}

export async function deactivateUser(userId: string): Promise<void> {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw NotFoundError('User not found');
  }

  if (!user.isActive) {
    throw BadRequestError('User is already deactivated');
  }

  await userRepository.deactivate(userId);
  logger.info('User deactivated', { userId, email: user.email });
}
