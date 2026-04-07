import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import adminRoutes from './modules/admin/admin.routes';
import productRoutes from './modules/products/product.routes';
import dropRoutes from './modules/drops/drop.routes';
import { errorHandler } from './middlewares/error.middleware';
import { sendError } from './utils/response';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'DropVault Backend is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/drops', dropRoutes);

app.use((_req, res) => {
  sendError(res, 'Route not found', 404);
});

app.use(errorHandler);

export default app;
