import prisma from '../../config/db';
import { Seller, SellerStatus } from '@prisma/client';
import {
  ISellerRepository,
  SellerWithUser,
} from '../interfaces/ISellerRepository';

export class PrismaSellerRepository implements ISellerRepository {
  async create(userId: string): Promise<Seller> {
    return prisma.seller.create({
      data: { userId },
    });
  }

  async findByUserId(userId: string): Promise<Seller | null> {
    return prisma.seller.findUnique({
      where: { userId },
    });
  }

  async findById(id: string): Promise<SellerWithUser | null> {
    return prisma.seller.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
      },
    });
  }

  async findAll(): Promise<SellerWithUser[]> {
    return prisma.seller.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByStatus(status: SellerStatus): Promise<SellerWithUser[]> {
    return prisma.seller.findMany({
      where: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: SellerStatus): Promise<Seller> {
    return prisma.seller.update({
      where: { id },
      data: { status },
    });
  }
}
