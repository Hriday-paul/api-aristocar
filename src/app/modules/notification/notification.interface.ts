import { ObjectId } from 'mongodb';
export enum modeType {
  RefundRequest = 'User',
  ShopWiseOrder = 'ShopWiseOrder',
  Order = 'Order',
  Payment = 'Payment',
}
export interface TNotification {
  receiver: ObjectId;
  message: string;
  description?: string;
  refference: ObjectId;
  model_type: modeType;
  date?: Date;
  read: boolean;
  isDeleted: boolean;
}
