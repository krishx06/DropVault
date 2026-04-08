import { Order } from '@prisma/client';
import prisma from '../../config/db';
import { PrismaOrderRepository } from '../../repositories/prisma/PrismaOrderRepository';
import { PrismaDropRepository } from '../../repositories/prisma/PrismaDropRepository';
import { CreateOrderInput } from './order.types';
import { validateCreateOrderInput } from './order.validators';
import { OrderWithDetails } from '../../repositories/interfaces/IOrderRepository';
import { BadRequestError, NotFoundError, ForbiddenError } from '../../utils/AppError';
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

  await prisma.$transaction([
    prisma.drop.update({
      where: { id: order.dropId },
      data: { sold: { decrement: order.quantity } },
    }),
    prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    }),
  ]);

  logger.info(`Order cancelled: orderId=${orderId}, userId=${userId}`);
  return { ...order, status: 'CANCELLED' };
}
