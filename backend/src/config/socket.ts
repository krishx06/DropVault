import { Server } from 'socket.io';
import http from 'http';
import { logger } from '../utils/logger';

let io: Server;

export function initSocket(httpServer: http.Server): Server {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  logger.info('Socket.IO initialized');
  return io;
}

export function getIO(): Server | null {
  return io ?? null;
}
