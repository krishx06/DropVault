import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import {
  placeOrderHandler,
  getMyOrdersHandler,
  cancelOrderHandler,
} from './order.controller';

const router = Router();

router.use(authenticate);

router.post('/', placeOrderHandler);
router.get('/me', getMyOrdersHandler);
router.patch('/:id/cancel', cancelOrderHandler);

export default router;
