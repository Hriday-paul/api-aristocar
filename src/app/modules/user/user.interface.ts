import { Model, Types } from 'mongoose';

export interface IUser {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // [x: string]: any;
  _id?: Types.ObjectId;
  status: string;
  username: string;
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  gender: 'Male' | 'Female' | 'Others';
  dateOfBirth: string;
  image: string;
  role: string;
  isGoogleLogin: boolean;
  user_address?: string;
  dealer_address?: {
    city?: string;
    country?: string;
    street?: string;
    vat_id: string;
    post_code: string;
  };

  vat_status: string;
  vat_type: string;
  companyName?: string;
  dealership?: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  isDeleted: boolean;
  isApproved: boolean;

  verification: {
    otp: string | number;
    expiresAt: Date;
    status: boolean;
  };
  freeExpairDate: Date;
  freeLimit: number;
  invoice_type: string;
  carCreateLimit: number;
  durationDay: number;
}

export interface UserModel extends Model<IUser> {
  isUserExist(email: string): Promise<IUser>;
  IsUserExistId(id: string): Promise<IUser>;
  IsUserExistUserName(userName: string): Promise<IUser>;

  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
