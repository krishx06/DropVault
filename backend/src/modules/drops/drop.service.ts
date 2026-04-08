import { Drop, DropStatus } from '@prisma/client';
import { PrismaDropRepository } from '../../repositories/prisma/PrismaDropRepository';
import { PrismaProductRepository } from '../../repositories/prisma/PrismaProductRepository';
import { PrismaSellerRepository } from '../../repositories/prisma/PrismaSellerRepository';
import { CreateDropInput, UpdateDropInput } from './drop.types';
import { DropWithProduct } from '../../repositories/interfaces/IDropRepository';
import { BadRequestError, NotFoundError, ForbiddenError } from '../../utils/AppError';
import { logger } from '../../utils/logger';

const dropRepository = new PrismaDropRepository();
const productRepository = new PrismaProductRepository();
const sellerRepository = new PrismaSellerRepository();

export async function getPublicDrops(status?: string): Promise<DropWithProduct[]> {
  if (status) {
    return dropRepository.findByStatus(status as DropStatus);
  }
  return dropRepository.findUpcomingAndLive();
}

export async function getDropById(dropId: string): Promise<DropWithProduct> {
  const drop = await dropRepository.findById(dropId);
  if (!drop) {
    throw NotFoundError('Drop not found');
  }
  return drop;
}

export async function createDrop(
  userId: string,
  input: CreateDropInput,
): Promise<Drop> {
  const seller = await sellerRepository.findByUserId(userId);
  if (!seller) {
    throw ForbiddenError('Seller profile not found');
  }

  const product = await productRepository.findById(input.productId);
  if (!product) {
    throw NotFoundError('Product not found');
  }

  if (product.sellerId !== seller.id) {
    throw ForbiddenError('You can only create drops for your own products');
  }

  if (!product.isApproved) {
    throw BadRequestError('Cannot schedule a drop for an unapproved product');
  }

  const startTime = new Date(input.startTime);
  const endTime = new Date(input.endTime);

  if (startTime >= endTime) {
    throw BadRequestError('End time must be after start time');
  }

  if (startTime <= new Date()) {
    throw BadRequestError('Start time must be in the future');
  }

  if (!input.stock || input.stock <= 0) {
    throw BadRequestError('Stock must be at least 1');
  }

  const drop = await dropRepository.create({
    productId: input.productId,
    startTime,
    endTime,
    stock: input.stock,
  });

  logger.info(`Drop scheduled for product: ${product.id} starting at ${startTime}`);
  return drop;
}

export async function getMyDrops(userId: string): Promise<Drop[]> {
  const seller = await sellerRepository.findByUserId(userId);
  if (!seller) {
    throw ForbiddenError('Seller profile not found');
  }

  return dropRepository.findBySellerId(seller.id);
}

export async function updateDrop(
  userId: string,
  dropId: string,
  input: UpdateDropInput,
): Promise<Drop> {
  const seller = await sellerRepository.findByUserId(userId);
  if (!seller) {
    throw ForbiddenError('Seller profile not found');
  }

  const existingDrop = await dropRepository.findById(dropId);
  if (!existingDrop) {
    throw NotFoundError('Drop not found');
  }

  if (existingDrop.product.sellerId !== seller.id) {
    throw ForbiddenError('You do not have permission to update this drop');
  }

  if (existingDrop.status !== 'UPCOMING') {
    throw BadRequestError('Cannot modify a drop that is already live or ended');
  }

  const updatable: UpdateDropInput = {};
  
  if (input.startTime || input.endTime) {
    const s = input.startTime ? new Date(input.startTime) : new Date(existingDrop.startTime);
    const e = input.endTime ? new Date(input.endTime) : new Date(existingDrop.endTime);
    
    if (s >= e) throw BadRequestError('End time must be after start time');
    if (s <= new Date()) throw BadRequestError('Start time must be in the future');

    updatable.startTime = s;
    updatable.endTime = e;
  }

  if (input.stock !== undefined) {
    if (input.stock < existingDrop.sold) {
      throw BadRequestError('New stock cannot be less than already sold items');
    }
    updatable.stock = input.stock;
  }

  if (input.status) {
    updatable.status = input.status;
  }

  const updatedDrop = await dropRepository.update(dropId, updatable);
  logger.info(`Drop updated: ${dropId}`);
  return updatedDrop;
}
