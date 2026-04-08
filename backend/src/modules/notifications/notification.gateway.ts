import { Server, Socket } from 'socket.io';
import { logger } from '../../utils/logger';

export function registerNotificationHandlers(io: Server): void {
  io.on('connection', (socket: Socket) => {
    socket.on('subscribe:drop', (dropId: string) => {
      socket.join(`drop:${dropId}`);
      logger.info(`Socket ${socket.id} subscribed to drop:${dropId}`);
    });

    socket.on('unsubscribe:drop', (dropId: string) => {
      socket.leave(`drop:${dropId}`);
    });
  });
}
