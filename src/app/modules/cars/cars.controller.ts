import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { carsService } from './cars.service';
import { storeFile } from '../../utils/fileHelper';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { CarModel } from './cars.models';
import Subscription from '../subscription/subscription.models';
import { IPackage } from '../packages/packages.interface';
import { User } from '../user/user.models';
import { Types } from 'mongoose';
import { USER_ROLE } from '../user/user.constants';

const createcars = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  // Fetch the user from the database
  const user = await User.findById(userId);

  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: 'User not found',
    });
  }

  if (user.role === USER_ROLE.dealer && !user.isApproved) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Dealer account is not approved by admin',
    );
  }

  // Check if the user has valid limits to create cars
  const currentDate = new Date();
  let canCreateCar = false;

  if (
    user.freeExpairDate &&
    currentDate <= user.freeExpairDate &&
    user.freeLimit > 0
  ) {
    canCreateCar = true; // Free limit is valid
  } else if (
    user.carCreateLimit &&
    user.carCreateLimit > 0 &&
    user.durationDay
  ) {
    canCreateCar = true; // Paid limit is valid
  }

  if (!canCreateCar) {
    return res.status(httpStatus.FORBIDDEN).json({
      success: false,
      message: 'You have reached your car creation limit',
    });
  }

  // Create the car
  req.body.creatorID = userId;
  const result = await carsService.createcars(req.body, req.files);

  // Deduct the limit after car creation
  if (user.freeExpairDate && currentDate <= user.freeExpairDate) {
    user.freeLimit -= 1; // Deduct from free limit
  } else if (user.carCreateLimit && user.carCreateLimit > 0) {
    user.carCreateLimit -= 1; // Deduct from paid limit
  }

  // Save the updated user data
  await user.save();

  // Send the response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car created successfully',
    data: { car: result },
  });
});

const getAllcars = catchAsync(async (req: Request, res: Response) => {
  const cars = await carsService.getAllcars(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All cars retrieved successfully',
    data: { cars },
  });
});

const getcarsById = catchAsync(async (req: Request, res: Response) => {
  const car = await carsService.getcarsById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car retrieved successfully',
    data: { car },
  });
});

const getBestDeals = catchAsync(async (req: Request, res: Response) => {
  const bestDeals = await carsService.getBestDeals();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Best deals retrieved successfully',
    data: { bestDeals },
  });
});

const getcarsByCreatorId = catchAsync(async (req: Request, res: Response) => {
  const car = await carsService.getcarsByCreatorId(req.params.creatorID);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car retrieved successfully',
    data: { car },
  });
});

const getcarsCountBycreatorId = catchAsync(
  async (req: Request, res: Response) => {
    const creatorID = req.user?.userId;
    const count = await carsService.getcarsCountBycreatorId(creatorID);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User created cars count retrieved successfully',
      data: count,
    });
  },
);

const updatecars = catchAsync(async (req: Request, res: Response) => {
  if (req.files && Array.isArray(req.files)) {
    const uploadedImages: string[] = req.files.map(file =>
      storeFile('carpictures', file.filename),
    );

    // Check for banner image
    if (
      req.files &&
      'bannerImage' in req.files &&
      Array.isArray(req.files['bannerImage'])
    ) {
      const uploadedBannerImages: string[] = req.files['bannerImage'].map(
        file => storeFile('carbanner', file.filename),
      );
      req.body.bannerImage = uploadedBannerImages; // Store banner images
    }

    req.body.images = uploadedImages;
  }

  const car = await carsService.updatecars(req.params.id, req.body, req.files);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car updated successfully',
    data: { car },
  });
});

const deletecars = catchAsync(async (req: Request, res: Response) => {
  await carsService.deletecars(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car deleted successfully',
    data: {},
  });
});

const getUserCarViewsByYear = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { year } = req.query;

    if (!year) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: 'Year parameter is required',
        data: {},
      });
    }

    const carViewsByMonth = await carsService.getCarViewsByYear(
      userId,
      year as string,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Car views by month for year ${year}`,
      data: carViewsByMonth,
    });
  },
);

const getMostWantedCars = catchAsync(async (req: Request, res: Response) => {
  const cars = await carsService.getMostWantedCars();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Most wanted cars retrieved successfully',
    data: cars,
  });
});

export const carsController = {
  createcars,
  getAllcars,
  getcarsById,
  updatecars,
  deletecars,
  getcarsCountBycreatorId,
  getUserCarViewsByYear,
  getcarsByCreatorId,
  getBestDeals,
  getMostWantedCars,
};
