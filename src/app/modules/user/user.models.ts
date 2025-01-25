import { Error, Query, Schema, model } from 'mongoose';
import config from '../../config';
import bcrypt from 'bcrypt';
import { IUser, UserModel } from './user.interface';
import { Role, USER_ROLE } from './user.constants';
import cron from 'node-cron';

const userSchema: Schema<IUser> = new Schema(
  {
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
    name: {
      type: String,
      // required: true,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Others'],
      default: null,
    },
    dateOfBirth: {
      type: String,
      default: null,
    },
    isGoogleLogin: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: Role,
      default: USER_ROLE.user,
    },
    companyName: {
      type: String,
      default: null,
    },
    dealership: {
      type: String,
      default: null,
    },
    user_address: {
      type: String,
      default: null,
    },
    dealer_address: {
      city: {
        type: String,
        default: null,
      },
      country: {
        type: String,
        default: null,
      },
      post_code: {
        type: String,
        default: null,
      },
      vat_id: {
        type: String,
        default: null,
      },

      street: {
        type: String,
        default: null,
      },
    },
    vat_status: {
      type: String,
      enum: ['valid', 'vat not valid'],
      default: 'valid',
    },
    vat_type: {
      type: String,
      default: null,
    },
    needsPasswordChange: {
      type: Boolean,
    },
    passwordChangedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    verification: {
      otp: {
        type: Schema.Types.Mixed,
        default: 0,
      },
      expiresAt: {
        type: Date,
      },
      status: {
        type: Boolean,
        default: false,
      },
    },
    freeExpairDate: {
      type: Date,
    },
    freeLimit: {
      type: Number,
    },
    carCreateLimit: {
      type: Number,
    },
    durationDay: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  const user = this;

  // Hash password if not using Google Login
  if (!user.isGoogleLogin) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds),
    );
  }

  next();
});
// set '' after saving password
userSchema.post(
  'save',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function (error: Error, doc: any, next: (error?: Error) => void): void {
    doc.password = '';
    next();
  },
);

userSchema.statics.isUserExist = async function (email: string) {
  return await User.findOne({ email: email }).select('+password');
};

userSchema.statics.IsUserExistId = async function (id: string) {
  return await User.findById(id).select('+password');
};
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<IUser, UserModel>('User', userSchema);

// Daily Cron Job to decrement durationDay
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily job to decrement durationDay...');
  try {
    const users = await User.find({ durationDay: { $gt: 0 } });

    for (const user of users) {
      user.durationDay -= 1; // Decrement durationDay
      if (user.durationDay === 0) {
        user.carCreateLimit = 0; // Reset carCreateLimit if durationDay expires
      }
      await user.save(); // Save the updated user
    }

    console.log('Daily job completed successfully.');
  } catch (error) {
    console.error('Error running daily job:', error);
  }
});
