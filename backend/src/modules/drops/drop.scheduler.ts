import prisma from '../../config/db';
import { logger } from '../../utils/logger';
import { emitDropActivated, emitDropEnded } from '../notifications/notification.service';

const SCHEDULER_INTERVAL_MS = 60_000; 

async function runSchedulerTick(): Promise<void> {
  const now = new Date();

  try {
    const toActivate = await prisma.drop.findMany({
      where: { status: 'UPCOMING', startTime: { lte: now } },
      include: { product: true },
    });

    for (const drop of toActivate) {
      await prisma.drop.update({
        where: { id: drop.id },
        data: { status: 'LIVE' },
      });
      logger.info(`Drop activated: ${drop.id} (${drop.product.name})`);
      emitDropActivated({
        dropId: drop.id,
        status: 'LIVE',
        productId: drop.product.id,
        productName: drop.product.name,
      });
    }

    const toEnd = await prisma.drop.findMany({
      where: { status: 'LIVE', endTime: { lte: now } },
      include: { product: true },
    });

    for (const drop of toEnd) {
      await prisma.drop.update({
        where: { id: drop.id },
        data: { status: 'ENDED' },
      });
      logger.info(`Drop ended: ${drop.id} (${drop.product.name})`);
      emitDropEnded({
        dropId: drop.id,
        status: 'ENDED',
        productId: drop.product.id,
        productName: drop.product.name,
      });
    }
  } catch (error) {
    logger.error('Drop scheduler tick failed', { error });
  }
}

export function startDropScheduler(): void {
  runSchedulerTick();
  setInterval(runSchedulerTick, SCHEDULER_INTERVAL_MS);
  logger.info('Drop scheduler started (60s interval)');
}
