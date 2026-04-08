import { Request, Response, NextFunction } from 'express';
import * as sellerService from './seller.service';
import { sendSuccess } from '../../utils/response';

export async function getMySellerProfileHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const profile = await sellerService.getMySellerProfile(req.user!.userId);
    sendSuccess(res, profile);
  } catch (error) {
    next(error);
  }
}
