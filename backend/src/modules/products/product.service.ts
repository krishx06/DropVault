import { Product } from '@prisma/client';
import { PrismaProductRepository } from '../../repositories/prisma/PrismaProductRepository';
import { PrismaSellerRepository } from '../../repositories/prisma/PrismaSellerRepository';
import { CreateProductInput, UpdateProductInput } from './product.types';
import { BadRequestError, NotFoundError, ForbiddenError } from '../../utils/AppError';
import { logger } from '../../utils/logger';

const productRepository = new PrismaProductRepository();
const sellerRepository = new PrismaSellerRepository();

export async function createProduct(
  userId: string,
  input: Omit<CreateProductInput, 'sellerId'>,
): Promise<Product> {
  const seller = await sellerRepository.findByUserId(userId);
  
  if (!seller) {
    throw ForbiddenError('Seller profile not found');
  }

  if (seller.status !== 'APPROVED') {
    throw ForbiddenError('Only approved sellers can create products');
  }

  if (!input.name || !input.price || input.price <= 0) {
    throw BadRequestError('Valid name and price are required');
  }

  const product = await productRepository.create({
    ...input,
    sellerId: seller.id,
  });

  logger.info(`Product created: ${product.id} by seller: ${seller.id}`);
  return product;
}

export async function getMyProducts(userId: string): Promise<Product[]> {
  const seller = await sellerRepository.findByUserId(userId);
  if (!seller) {
    throw ForbiddenError('Seller profile not found');
  }

  return productRepository.findBySellerId(seller.id);
}

export async function updateProduct(
  userId: string,
  productId: string,
  input: UpdateProductInput,
): Promise<Product> {
  const seller = await sellerRepository.findByUserId(userId);
  if (!seller) {
    throw ForbiddenError('Seller profile not found');
  }

  const existingProduct = await productRepository.findById(productId);
  if (!existingProduct) {
    throw NotFoundError('Product not found');
  }

  if (existingProduct.sellerId !== seller.id) {
    throw ForbiddenError('You do not have permission to update this product');
  }

  const updatedProduct = await productRepository.update(productId, input);
  logger.info(`Product updated: ${productId}`);
  return updatedProduct;
}

export async function getApprovedProducts(): Promise<Product[]> {
  return productRepository.findApproved();
}

export async function getProductById(productId: string): Promise<Product> {
  const product = await productRepository.findById(productId);
  if (!product) {
    throw NotFoundError('Product not found');
  }
  return product;
}

export async function updateProductApproval(
  productId: string,
  isApproved: boolean,
): Promise<Product> {
  const existingProduct = await productRepository.findById(productId);
  if (!existingProduct) {
    throw NotFoundError('Product not found');
  }

  const updatedProduct = await productRepository.updateApproval(productId, isApproved);
  logger.info(`Product ${productId} approval status changed to: ${isApproved}`);
  
  return updatedProduct;
}
