/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { IUser } from './user.interface';
import { User } from './user.models';
import QueryBuilder from '../../builder/QueryBuilder';
import { USER_ROLE } from './user.constants';
import { validateVATNumber } from 'validate-vat';
import { sendEmail } from '../../utils/mailSender';
import fs from 'fs';
import path from 'path';

export type IFilter = {
  searchTerm?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};
const createUser = async (payload: IUser): Promise<IUser> => {
  const isExist = await User.isUserExist(payload.email as string);

  if (isExist) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'User already exists with this email',
    );
  }

  // If the user is registering as a dealer, set isApproved to false
  if (payload.role === USER_ROLE.dealer) {
    payload.isApproved = false; // Dealer accounts need admin approval

    const emailPath = path.join(
      __dirname,
      '../../../../public/view/dealerRegisterMail.html',
    );
    // If 'isApproved' is set to true, send an email
    await sendEmail(
      payload?.email,
      'Your account is under review',
      fs
        .readFileSync(emailPath, 'utf8')
        .replace('{{name}}', payload?.name)
        .replace('{{email}}', payload?.email),
    );
  }

  if (payload?.isGoogleLogin) {
    payload.verification = {
      otp: 0,
      expiresAt: new Date(Date.now()),
      status: true,
    };
  }

  if (!payload.isGoogleLogin && !payload.password) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Password is required');
  }

  if (
    payload.role === USER_ROLE.dealer &&
    (!payload.companyName || !payload.dealership)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Company name and dealership are required for dealer role.',
    );
  }

  // if (payload.role === USER_ROLE.dealer) {
  //   if (payload.dealer_address?.vat_id) {
  //     try {
  //       const result = await validateVATNumber(payload.dealer_address.vat_id);

  //       // Update VAT status based on validation result
  //       payload.vat_status = result.isValid ? 'valid' : 'vat not valid';
  //     } catch (error) {
  //       console.error('VAT validation error:'); // Log the error for debugging
  //       payload.vat_status = 'vat not valid'; // Fallback status
  //       throw new AppError(httpStatus.NOT_FOUND, 'VAT ID Not Valid');
  //     }
  //   } else {
  //     // If VAT ID is not provided, set status as 'vat not valid'
  //     payload.vat_status = 'vat not valid';
  //   }
  // }

  const user = await User.create(payload);
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User creation failed');
  }
  return user;
};

const getAllUser = async (query: Record<string, any>) => {
  const userModel = new QueryBuilder(User.find(), query)
    .search(['name', 'email', 'phoneNumber', 'status'])
    .filter()
    .paginate()
    .sort();
  const data: any = await userModel.modelQuery;
  const meta = await userModel.countTotal();
  return {
    data,
    meta,
  };
};

const getAllUserByYearandmonth = async (year: string) => {
  const startOfYear = new Date(`${year}-01-01`);
  const endOfYear = new Date(`${year}-12-31T23:59:59`);

  // Initialize an object to hold counts for each month
  const userCountsByMonth: Record<string, number> = {
    January: 0,
    February: 0,
    March: 0,
    April: 0,
    May: 0,
    June: 0,
    July: 0,
    August: 0,
    September: 0,
    October: 0,
    November: 0,
    December: 0,
  };

  // Query to get all users within the year
  const users = await User.find({
    createdAt: {
      $gte: startOfYear,
      $lte: endOfYear,
    },
  });

  // Loop through the users and count them by month
  users.forEach(user => {
    const month = new Date(user.createdAt).toLocaleString('default', {
      month: 'long',
    });
    if (userCountsByMonth[month] !== undefined) {
      userCountsByMonth[month]++;
    }
  });

  return userCountsByMonth;
};

const geUserById = async (id: string) => {
  const result = await User.findById(id);
  return result;
};

const getAllDealerRequests = async () => {
  return await User.find({ role: USER_ROLE.dealer, isApproved: false });
};

const handleDealerRequest = async (dealerId: string, isApproved: boolean) => {
  const dealer = await User.findById(dealerId);

  if (!dealer || dealer.role !== USER_ROLE.dealer) {
    throw new AppError(httpStatus.NOT_FOUND, 'Dealer request not found');
  }

  if (isApproved) {
    dealer.isApproved = true;
  } else {
    dealer.isApproved = false;
    dealer.role = USER_ROLE.user;
  }

  await dealer.save();

  return dealer;
};

const getAllDealers = async (query: Record<string, any>) => {
  const dealerQuery = new QueryBuilder(
    User.find({ role: USER_ROLE.dealer }),
    query,
  )
    .search(['name', 'email', 'phoneNumber', 'status'])
    .filter()
    .paginate()
    .sort();

  const data = await dealerQuery.modelQuery;
  const meta = await dealerQuery.countTotal();

  return {
    data,
    meta,
  };
};

const updateUser = async (id: string, payload: Partial<IUser>) => {
  // Check if the user exists
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Manage user payload based on role
  if (user.role === USER_ROLE.dealer) {
    delete payload.user_address;
  } else {
    delete payload.dealer_address;
  }

  // Exclude fields that cannot be updated
  const restrictedFields = [
    'email',
    'dealership',
    'invoice_type',
    'isGoogleLogin',
    'password',
    'role',
    'verification',
    'isDeleted',
  ] as Array<keyof IUser>;

  restrictedFields.forEach(field => {
    delete (payload as Partial<Record<keyof IUser, any>>)[field];
  });

  // Update the user
  const updatedUser = await User.findByIdAndUpdate(id, payload, {
    new: true, // Return the updated document
    runValidators: true, // Apply schema validation
  });

  if (!updatedUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User update failed');
  }

  // Remove the password from the response
  (updatedUser.password as any) = undefined;

  const emailPath = path.join(
    __dirname,
    '../../../../public/view/delearApproved.html',
  );
  // If 'isApproved' is set to true, send an email
  if (payload.isApproved === true) {
    await sendEmail(
      updatedUser?.email,
      'Your account has been approved',
      fs
        .readFileSync(emailPath, 'utf8')
        .replace('{{name}}', updatedUser?.name)
        .replace('{{email}}', user?.email),
    );
  }

  return updatedUser;
};

const deleteUser = async (id: string) => {
  const user = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'user deleting failed');
  }

  return user;
};

export const userService = {
  createUser,
  getAllUser,
  geUserById,
  updateUser,
  deleteUser,
  getAllDealerRequests,
  handleDealerRequest,
  getAllUserByYearandmonth,
  getAllDealers,
};
