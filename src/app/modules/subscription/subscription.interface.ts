import { Model, ObjectId } from 'mongoose';
import { IPackage } from '../packages/packages.interface';

export interface ISubscriptions {
  user: ObjectId;
  package: ObjectId | IPackage;
  isPaid: boolean;
  trnId: string;
  amount: number;
  expiredAt: Date;
  isExpired: boolean;
  isDeleted: boolean;
  createdAt: Date;
}

export type ISubscriptionsModel = Model<
  ISubscriptions,
  Record<string, unknown>
>;
