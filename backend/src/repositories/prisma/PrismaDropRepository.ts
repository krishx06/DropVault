import prisma from '../../config/db';
import { Drop, DropStatus } from '@prisma/client';
import { IDropRepository, DropWithProduct } from '../interfaces/IDropRepository';
import { CreateDropInput, UpdateDropInput } from '../../modules/drops/drop.types';

export class PrismaDropRepository implements IDropRepository {
  async create(data: CreateDropInput): Promise<Drop> {
    return prisma.drop.create({
      data: {
        productId: data.productId,
        startTime: data.startTime,
        endTime: data.endTime,
        stock: data.stock,
      },
    });
  }

  async findById(id: string): Promise<DropWithProduct | null> {
    return prisma.drop.findUnique({
      where: { id },
      include: { product: true },
    });
  }

  async findBySellerId(sellerId: string): Promise<DropWithProduct[]> {
    return prisma.drop.findMany({
      where: { product: { sellerId } },
      include: { product: true },
      orderBy: { startTime: 'asc' },
    });
  }

  async findLiveDrops(): Promise<DropWithProduct[]> {
    const now = new Date();
    return prisma.drop.findMany({
      where: {
        status: 'UPCOMING', 
        startTime: { lte: now },
        endTime: { gt: now },
      },
      include: { product: true },
      orderBy: { startTime: 'asc' },
    });
  }

  async findByStatus(status: DropStatus): Promise<DropWithProduct[]> {
    return prisma.drop.findMany({
      where: { status },
      include: { product: true },
      orderBy: { startTime: 'asc' },
    });
  }

  async findUpcomingAndLive(): Promise<DropWithProduct[]> {
    return prisma.drop.findMany({
      where: { status: { in: ['UPCOMING', 'LIVE'] } },
      include: { product: true },
      orderBy: { startTime: 'asc' },
    });
  }

  async update(id: string, data: UpdateDropInput): Promise<Drop> {
    return prisma.drop.update({
      where: { id },
      data,
    });
  }
}
