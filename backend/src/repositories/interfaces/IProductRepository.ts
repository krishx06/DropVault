import { Product } from '@prisma/client';
import { CreateProductInput, UpdateProductInput } from '../../modules/products/product.types';

export interface IProductRepository {
  create(data: CreateProductInput): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findBySellerId(sellerId: string): Promise<Product[]>;
  update(id: string, data: UpdateProductInput): Promise<Product>;
  updateApproval(id: string, isApproved: boolean): Promise<Product>;
}
