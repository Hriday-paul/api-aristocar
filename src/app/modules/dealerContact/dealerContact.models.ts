import mongoose, { Error, Query, Schema, model } from 'mongoose';
import config from '../../config';
import bcrypt from 'bcrypt';
import { Role, USER_ROLE } from '../user/user.constants';
import { IdealerContact } from './dealerContact.interface';

const DealerContactSchema: Schema<IdealerContact> = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true },
    description: { type: String, required: true },
    phone: { type: String, required: true },
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
    },
  },
  { timestamps: true },
);

const DealerContact = mongoose.model<IdealerContact>(
  'dealerContact',
  DealerContactSchema,
);
export default DealerContact;
