import prisma from '../../config/db';
import { Product } from '@prisma/client';
import { IProductRepository } from '../interfaces/IProductRepository';
import { CreateProductInput, UpdateProductInput } from '../../modules/products/product.types';

export class PrismaProductRepository implements IProductRepository {
  async create(data: CreateProductInput): Promise<Product> {
    return prisma.product.create({
      data: {
        sellerId: data.sellerId,
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl,
      },
    });
  }

  async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
    });
  }

  async findBySellerId(sellerId: string): Promise<Product[]> {
    return prisma.product.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: UpdateProductInput): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async findApproved(): Promise<Product[]> {
    return prisma.product.findMany({
      where: { isApproved: true, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateApproval(id: string, isApproved: boolean): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: { isApproved },
    });
  }
}
