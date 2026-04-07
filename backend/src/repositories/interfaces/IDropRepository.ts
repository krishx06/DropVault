import { Drop, Product } from '@prisma/client';
import { CreateDropInput, UpdateDropInput } from '../../modules/drops/drop.types';

export interface DropWithProduct extends Drop {
  product: Product;
}

export interface IDropRepository {
  create(data: CreateDropInput): Promise<Drop>;
  findById(id: string): Promise<DropWithProduct | null>;
  findBySellerId(sellerId: string): Promise<DropWithProduct[]>;
  findLiveDrops(): Promise<DropWithProduct[]>;
  update(id: string, data: UpdateDropInput): Promise<Drop>;
}
