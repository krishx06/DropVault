import { Request, Response, NextFunction } from 'express';
import * as productService from './product.service';
import { sendSuccess } from '../../utils/response';

export async function createProductHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const product = await productService.createProduct(userId, req.body);
    sendSuccess(res, product, 'Product created successfully', 201);
  } catch (error) {
    next(error);
  }
}

export async function getMyProductsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const products = await productService.getMyProducts(userId);
    sendSuccess(res, products);
  } catch (error) {
    next(error);
  }
}

export async function updateProductHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const productId = req.params.id as string;
    const product = await productService.updateProduct(userId, productId, req.body);
    sendSuccess(res, product, 'Product updated successfully');
  } catch (error) {
    next(error);
  }
}

export async function getApprovedProductsHandler(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const products = await productService.getApprovedProducts();
    sendSuccess(res, products);
  } catch (error) {
    next(error);
  }
}

export async function getProductByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const product = await productService.getProductById(req.params.id as string);
    sendSuccess(res, product);
  } catch (error) {
    next(error);
  }
}

export async function approveProductHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const productId = req.params.id as string;
    const { isApproved } = req.body;
    
    if (typeof isApproved !== 'boolean') {
      res.status(400).json({ success: false, message: 'isApproved must be a boolean' });
      return;
    }

    const product = await productService.updateProductApproval(productId, isApproved);
    sendSuccess(res, product, `Product ${isApproved ? 'approved' : 'unapproved'} successfully`);
  } catch (error) {
    next(error);
  }
}
