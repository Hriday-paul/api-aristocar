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

const createcars = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  const subscription = await Subscription.findOne({
    user: new Types.ObjectId(userId),
    isExpired: false,
    isDeleted: false,
  }).populate('package');

  if (!subscription) {
    const user = await User.findById(userId);

    const currentDate = new Date();
    if (!user?.freeExpairDate || currentDate > user.freeExpairDate) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: 'Your free car creation period has expired.',
        data: {},
      });
    }

    const createdCarsCount = await carsService.getcarsCountBycreatorId(userId);
    if (Number(createdCarsCount) >= (Number(user.freeLimit) || 0)) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: 'You have reached the free car creation limit.',
        data: {},
      });
    }
  } else {
    const { expiredAt } = subscription;
    const currentDate = new Date();

    if (!expiredAt || currentDate > expiredAt) {
      subscription.isExpired = true;
      await subscription.save();

      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: 'Your subscription has expired.',
        data: {},
      });
    }

    const { carCreateLimit } = subscription.package as IPackage;
    const createdCarsCount = await CarModel.countDocuments({
      creatorID: new Types.ObjectId(userId),
    });

    if (createdCarsCount >= carCreateLimit) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: 'You have reached the car creation limit for your package.',
        data: {},
      });
    }
  }
  req.body.creatorID = userId;
  const result = await carsService.createcars(req.body, req.files);
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

    // if (!creatorID) {
    //   throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
    // }
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
    if (req.files['bannerImage'] && Array.isArray(req.files['bannerImage'])) {
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
