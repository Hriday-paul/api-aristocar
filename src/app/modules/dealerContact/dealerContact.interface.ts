import mongoose from 'mongoose';

export interface IdealerContact {
  firstName: string;
  lastName: string;
  email: string;
  description: string;
  phone: string;
  carId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
}
