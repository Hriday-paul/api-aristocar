import mongoose, { Error, Query, Schema, model } from 'mongoose';
import config from '../../config';
import bcrypt from 'bcrypt';
import { Role, USER_ROLE } from '../user/user.constants';
import { Icontact } from './contact.interface';

const ContactSchema: Schema<Icontact> = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    description: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

const contact = mongoose.model<Icontact>('contact', ContactSchema);
export default contact;
