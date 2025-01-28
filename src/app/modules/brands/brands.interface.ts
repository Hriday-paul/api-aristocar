import mongoose, { ObjectId } from 'mongoose';

export interface Ibrand {
  brandName: string;
  image?: string;
  isHome?: boolean;
}
