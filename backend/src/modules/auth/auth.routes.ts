import { Router } from 'express';
import { registerHandler, loginHandler, getProfileHandler } from './auth.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/register', registerHandler);
router.post('/login', loginHandler);

router.get('/me', authenticate, getProfileHandler);

export default router;
