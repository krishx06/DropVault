import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import {
  getPublicSellersHandler,
  getMySellerProfileHandler,
  getSellerOrdersHandler,
  confirmSellerOrderHandler,
} from './seller.controller';

const router = Router();

router.get('/', getPublicSellersHandler);

router.use(authenticate, authorize('SELLER'));

router.get('/me', getMySellerProfileHandler);
router.get('/orders', getSellerOrdersHandler);
router.patch('/orders/:id/confirm', confirmSellerOrderHandler);

export default router;
