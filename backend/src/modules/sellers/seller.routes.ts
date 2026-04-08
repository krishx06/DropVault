import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { getMySellerProfileHandler } from './seller.controller';

const router = Router();

router.get('/me', authenticate, authorize('SELLER'), getMySellerProfileHandler);

export default router;
