import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { updateProfileHandler } from './user.controller';

const router = Router();

router.patch('/profile', authenticate, updateProfileHandler);

export default router;
