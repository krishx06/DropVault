import { PrismaClient } from '@prisma/client';
import { env } from './env';

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'warn', 'error']
      : ['error'],
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
