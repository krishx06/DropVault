import { getIO } from '../../config/socket';
import { NotificationEvent, DropStatusPayload } from './notification.types';
import { logger } from '../../utils/logger';

export function emitDropActivated(payload: DropStatusPayload): void {
  const io = getIO();
  if (!io) return;
  io.emit(NotificationEvent.DROP_ACTIVATED, payload);
  logger.info(`Emitted drop:activated for drop=${payload.dropId}`);
}

export function emitDropEnded(payload: DropStatusPayload): void {
  const io = getIO();
  if (!io) return;
  io.emit(NotificationEvent.DROP_ENDED, payload);
  logger.info(`Emitted drop:ended for drop=${payload.dropId}`);
}

export function emitDropSoldOut(payload: DropStatusPayload): void {
  const io = getIO();
  if (!io) return;
  io.emit(NotificationEvent.DROP_SOLD_OUT, payload);
  logger.info(`Emitted drop:sold_out for drop=${payload.dropId}`);
}
