import http from 'http';
import { env } from './config/env';
import app from './app';
import { initSocket } from './config/socket';
import { registerNotificationHandlers } from './modules/notifications/notification.gateway';
import { startDropScheduler } from './modules/drops/drop.scheduler';
import { logger } from './utils/logger';

const PORT = env.PORT;

const httpServer = http.createServer(app);

const io = initSocket(httpServer);
registerNotificationHandlers(io);

startDropScheduler();

httpServer.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  logger.info(`Environment: ${env.NODE_ENV}`);
});
