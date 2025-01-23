import mongoose, { ObjectId } from 'mongoose';

export interface Imodel {
  modelName: string;
  brandId: ObjectId;
}
