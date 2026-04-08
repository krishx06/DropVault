import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import {
  createProductHandler,
  getMyProductsHandler,
  updateProductHandler,
  getApprovedProductsHandler,
  getProductByIdHandler,
} from './product.controller';

const router = Router();

router.post('/', authenticate, authorize('SELLER'), createProductHandler);
router.get('/me', authenticate, authorize('SELLER'), getMyProductsHandler);
router.patch('/:id', authenticate, authorize('SELLER'), updateProductHandler);

router.get('/', getApprovedProductsHandler);
router.get('/:id', getProductByIdHandler);

export default router;
