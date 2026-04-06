import { Request, Response, NextFunction } from 'express';
import * as adminService from './admin.service';
import { sendSuccess } from '../../utils/response';

export async function getPendingSellersHandler(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const sellers = await adminService.getPendingSellers();
    sendSuccess(res, sellers, 'Pending sellers retrieved');
  } catch (error) {
    next(error);
  }
}

export async function getAllSellersHandler(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const sellers = await adminService.getAllSellers();
    sendSuccess(res, sellers, 'All sellers retrieved');
  } catch (error) {
    next(error);
  }
}

export async function updateSellerStatusHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const seller = await adminService.updateSellerStatus({
      sellerId: req.params.id as string,
      status: req.body.status,
    });
    sendSuccess(res, seller, `Seller ${req.body.status.toLowerCase()} successfully`);
  } catch (error) {
    next(error);
  }
}

export async function getAllUsersHandler(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const users = await adminService.getAllUsers();
    sendSuccess(res, users, 'Users retrieved');
  } catch (error) {
    next(error);
  }
}

export async function deactivateUserHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await adminService.deactivateUser(req.params.id as string);
    sendSuccess(res, null, 'User deactivated successfully');
  } catch (error) {
    next(error);
  }
}
