export enum NotificationEvent {
  DROP_ACTIVATED = 'drop:activated',
  DROP_ENDED = 'drop:ended',
  DROP_SOLD_OUT = 'drop:sold_out',
}

export interface DropStatusPayload {
  dropId: string;
  status: string;
  productId: string;
  productName: string;
}
