import prisma from '../../config/db';
import { PrismaSellerRepository } from '../../repositories/prisma/PrismaSellerRepository';
import { SellerWithUser } from '../../repositories/interfaces/ISellerRepository';
import { ForbiddenError } from '../../utils/AppError';

const sellerRepository = new PrismaSellerRepository();

export async function getPublicSellers() {
  return prisma.seller.findMany({
    where: { status: 'APPROVED' },
    include: {
      user: { select: { name: true } },
      _count: { select: { products: true } },
    },
    orderBy: { createdAt: 'asc' },
    take: 6,
  });
}

export async function getMySellerProfile(userId: string): Promise<SellerWithUser> {
  const seller = await sellerRepository.findByUserId(userId);
  if (!seller) {
    throw ForbiddenError('Seller profile not found');
  }

  const full = await sellerRepository.findById(seller.id);
  return full!;
}
