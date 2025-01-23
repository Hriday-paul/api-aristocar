import mongoose, { ObjectId } from 'mongoose';

export interface Icontact {
  firstName: string;
  lastName: string;
  email: string;
  description: string;
  userId: ObjectId;
}
