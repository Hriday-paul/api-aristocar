import mongoose, { ObjectId } from 'mongoose';

export interface IMostWanted {
  image: string;
  description: string;
  carId: ObjectId;
}
