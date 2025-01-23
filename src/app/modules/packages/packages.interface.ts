import { Model } from 'mongoose';

export interface IPackage {
  _id?: string;
  title: string;
  shortTitle: string;
  shortDescription: string;
  price: number;
  carCreateLimit: number;
  durationDay: number;
  isDeleted: boolean;
}

export type IPackageModel = Model<IPackage, Record<string, unknown>>;
