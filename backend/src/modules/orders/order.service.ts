import { Order } from '@prisma/client';
import prisma from '../../config/db';
import { PrismaOrderRepository } from '../../repositories/prisma/PrismaOrderRepository';
import { PrismaDropRepository } from '../../repositories/prisma/PrismaDropRepository';
import { CreateOrderInput } from './order.types';
import { validateCreateOrderInput } from './order.validators';
import { OrderWithDetails } from '../../repositories/interfaces/IOrderRepository';
import { BadRequestError, NotFoundError, ForbiddenError } from '../../utils/AppError';
import { canTransition } from './order.states';
import { logger } from '../../utils/logger';

const orderRepository = new PrismaOrderRepository();
const dropRepository = new PrismaDropRepository();

export async function placeOrder(
  userId: string,
  input: CreateOrderInput,
): Promise<Order> {
  validateCreateOrderInput(input);

  const drop = await dropRepository.findById(input.dropId);
  if (!drop) {
    throw NotFoundError('Drop not found');
  }

  if (drop.status !== 'LIVE') {
    throw BadRequestError('This drop is not currently live');
  }

  const quantity = input.quantity ?? 1;
  const availableStock = drop.stock - drop.sold;

  if (quantity > availableStock) {
    throw BadRequestError(`Only ${availableStock} item(s) remaining in this drop`);
  }

  const totalAmount = drop.product.price * quantity;

  const [, order] = await prisma.$transaction([
    prisma.drop.update({
      where: { id: drop.id },
      data: { sold: { increment: quantity } },
    }),
    prisma.order.create({
      data: { userId, dropId: drop.id, quantity, totalAmount },
    }),
  ]);

  const newSold = drop.sold + quantity;
  if (newSold >= drop.stock) {
    await prisma.drop.update({
      where: { id: drop.id },
      data: { status: 'SOLD_OUT' },
    });
  }

  logger.info(`Order placed: user=${userId}, drop=${drop.id}, qty=${quantity}`);
  return order;
}

export async function getMyOrders(userId: string): Promise<OrderWithDetails[]> {
  return orderRepository.findByUserId(userId);
}

export async function getOrdersForSeller(userId: string) {
  const seller = await prisma.seller.findUnique({ where: { userId } });
  if (!seller) throw ForbiddenError('Seller not found');

  return prisma.order.findMany({
    where: { drop: { product: { sellerId: seller.id } } },
    include: {
      drop: { include: { product: true } },
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function confirmOrderBySeller(userId: string, orderId: string): Promise<Order> {
  const seller = await prisma.seller.findUnique({ where: { userId } });
  if (!seller) throw ForbiddenError('Seller not found');

  const order = await orderRepository.findById(orderId);
  if (!order) throw NotFoundError('Order not found');

  if (order.drop.product.sellerId !== seller.id) {
    throw ForbiddenError('This order does not belong to your drop');
  }

  if (!canTransition(order.status, 'CONFIRMED')) {
    throw BadRequestError('Order cannot be confirmed in its current state');
  }

  logger.info(`Order confirmed by seller: orderId=${orderId}, sellerId=${seller.id}`);
  return orderRepository.updateStatus(orderId, 'CONFIRMED');
}

export async function cancelOrder(userId: string, orderId: string): Promise<Order> {
  const order = await orderRepository.findById(orderId);
  if (!order) {
    throw NotFoundError('Order not found');
  }

  if (order.userId !== userId) {
    throw ForbiddenError('You do not have permission to cancel this order');
  }

  if (order.status !== 'PENDING') {
    throw BadRequestError('Only pending orders can be cancelled');
  }

  const drop = await dropRepository.findById(order.dropId);

  const newSold = (drop?.sold ?? 0) - order.quantity;
  const isWithinWindow = drop && new Date() < new Date(drop.endTime);
  const shouldRevertToLive = drop?.status === 'SOLD_OUT' && newSold < (drop?.stock ?? 0) && isWithinWindow;

  await prisma.$transaction([
    prisma.drop.update({
      where: { id: order.dropId },
      data: {
        sold: { decrement: order.quantity },
        ...(shouldRevertToLive ? { status: 'LIVE' } : {}),
      },
    }),
    prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    }),
  ]);

  logger.info(`Order cancelled: orderId=${orderId}, userId=${userId}`);
  return { ...order, status: 'CANCELLED' };
}
