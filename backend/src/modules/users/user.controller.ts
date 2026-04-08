import { Request, Response, NextFunction } from 'express';
import * as userService from './user.service';
import { sendSuccess } from '../../utils/response';

export async function updateProfileHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = await userService.updateProfile(req.user!.userId, req.body);
    sendSuccess(res, user, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
}
