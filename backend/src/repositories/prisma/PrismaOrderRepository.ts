import prisma from '../../config/db';
import { Order, OrderStatus } from '@prisma/client';
import { IOrderRepository, OrderWithDetails, CreateOrderData } from '../interfaces/IOrderRepository';

export class PrismaOrderRepository implements IOrderRepository {
  async create(data: CreateOrderData): Promise<Order> {
    return prisma.order.create({
      data: {
        userId: data.userId,
        dropId: data.dropId,
        quantity: data.quantity,
        totalAmount: data.totalAmount,
      },
    });
  }

  async findById(id: string): Promise<OrderWithDetails | null> {
    return prisma.order.findUnique({
      where: { id },
      include: { drop: { include: { product: true } } },
    });
  }

  async findByUserId(userId: string): Promise<OrderWithDetails[]> {
    return prisma.order.findMany({
      where: { userId },
      include: { drop: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByDropId(dropId: string): Promise<Order[]> {
    return prisma.order.findMany({
      where: { dropId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    return prisma.order.update({
      where: { id },
      data: { status },
    });
  }
}
