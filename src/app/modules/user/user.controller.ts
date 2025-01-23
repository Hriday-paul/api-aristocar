import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { userService } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { uploadToS3 } from '../../utils/s3';
import { otpServices } from '../otp/otp.service';
import { User } from './user.models';
import { UploadedFiles } from '../../interface/common.interface';
import { storeFile } from '../../utils/fileHelper';
import AppError from '../../error/AppError';

const createUser = catchAsync(async (req: Request, res: Response) => {
  // return res.send({data: req.body})
  if (req.file) {
    req.body.image = await uploadToS3({
      file: req.file, // Ensure it's req.file for a single file
      fileName: `images/user/profile/${Math.floor(100000 + Math.random() * 900000)}`,
    });
  }

  const result = await userService.createUser(req.body);
  const sendOtp = await otpServices.resendOtp(result?.email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully',
    data: { user: result, otpToken: sendOtp },
  });
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getAllUser(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users fetched successfully',
    data: result,
  });
});

const getAllUserByYearandmonth = catchAsync(
  async (req: Request, res: Response) => {
    const year = req.params.year;
    const result = await userService.getAllUserByYearandmonth(year as any);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Users fetched successfully',
      data: result,
    });
  },
);

const getAllDealers = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getAllDealers(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dealers fetched successfully',
    data: result,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.geUserById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User fetched successfully',
    data: result,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.geUserById(req?.user?.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'profile fetched successfully',
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  // Handle file upload
  if (req.file) {
    req.body.image = await uploadToS3({
      file: req.file,
      fileName: `images/user/profile/${Math.floor(100000 + Math.random() * 900000)}`,
    });
  }

  // Call the service to update the user
  const updatedUser = await userService.updateUser(req.params.id, req.body);

  // Respond with the updated user data
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: updatedUser,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (req.file) {
    req.body.image = await uploadToS3({
      file: req.file,
      fileName: `images/user/profile/${Math.floor(100000 + Math.random() * 900000)}`,
    });
  }
  const result = await userService.updateUser(userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'profile updated successfully',
    data: result,
  });
});

const getAllDealerRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getAllDealerRequests();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dealer requests fetched successfully',
    data: result,
  });
});

const handleDealerRequest = catchAsync(async (req: Request, res: Response) => {
  const { dealerId } = req.params;
  const { isApproved } = req.body;

  if (typeof isApproved !== 'boolean') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid approval status');
  }

  const result = await userService.handleDealerRequest(dealerId, isApproved);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Dealer request ${
      isApproved ? 'approved' : 'rejected'
    } successfully`,
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.deleteUser(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

const deleteMYAccount = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.deleteUser(req.user?.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

export const userController = {
  createUser,
  getAllUser,
  getUserById,
  getMyProfile,
  updateUser,
  updateMyProfile,
  deleteUser,
  deleteMYAccount,
  getAllDealerRequests,
  handleDealerRequest,
  getAllUserByYearandmonth,
  getAllDealers,
};
