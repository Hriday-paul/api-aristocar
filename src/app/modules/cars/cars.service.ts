import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { ICar, udIcar } from './cars.interface';
import { CarModel } from './cars.models';
import QueryBuilder from '../../builder/QueryBuilder';
import { UploadedFiles } from '../../interface/common.interface';
import { uploadManyToS3 } from '../../utils/s3';
import { Types } from 'mongoose';
import Subscription from '../subscription/subscription.models';
import Package from '../packages/packages.models';
import { IPackage } from '../packages/packages.interface';
import { User } from '../user/user.models';
import { populate } from 'dotenv';

const createcars = async (payload: ICar, files: any): Promise<ICar> => {
  if (files) {
    const { images } = files as UploadedFiles;
    payload.images = [{ url: '', key: '' }];

    if (images?.length) {
      const imgsArray: { file: any; path: string; key?: string }[] = [];

      images?.map(async image => {
        imgsArray.push({
          file: image,
          path: `images/car/images/${Math.floor(100000 + Math.random() * 900000)}`,
        });
      });

      payload.images = await uploadManyToS3(imgsArray);
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, 'Upload minimum 1 image');
    }
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, 'Upload minimum 1 image');
  }

  const car = await CarModel.create(payload);
  return car;
};

const getAllcars = async (query: Record<string, any>) => {
  const isQueryEmpty = Object.keys(query).length === 0;
  // url?priceRange=10-50&mileageRange=50-100&
  let data, meta;
  if (isQueryEmpty) {
    data = await CarModel.find({})
      .populate('brand')
      .populate('model')
      .populate('creatorID');
    // meta = { total: data.length };
    const carsModel = new QueryBuilder(CarModel.find({}), {});
    meta = await carsModel.countTotal();
  } else {
    const { priceRange, mileageRange, YearOfManufactureRange, ...allQuery } =
      query;
    const carsModel = new QueryBuilder(CarModel.find({}), allQuery)
      .search(['name'])
      .conditionalFilter()
      .sort()
      .rangeFilter('price', priceRange)
      .rangeFilter('mileage', mileageRange)
      .rangeFilter('YearOfManufacture', YearOfManufactureRange)
      .paginate()
      .fields();
    data = (await carsModel.modelQuery
      .populate('brand')
      .populate('model')
      .populate('creatorID')) as ICar[];
    meta = await carsModel.countTotal();
  }
  return { data, meta };
};

const getcarsById = async (id: string): Promise<ICar | string> => {
  const car = await CarModel.findById(id)
    .populate('brand')
    .populate('model')
    .populate('creatorID');

  if (!car) {
    return 'No car found';
  }

  await CarModel.findByIdAndUpdate(id, {
    $inc: { view_count: 1 },
  });

  return car;
};

const getcarsByCreatorId = async (creatorID: string): Promise<ICar> => {
  const car = await CarModel.find({ creatorID })
    .populate('creatorID')
    .populate('brand')
    .populate('model');
  if (!car) {
    throw new AppError(httpStatus.NOT_FOUND, 'Car not found');
  }
  await CarModel.findByIdAndUpdate(creatorID, {
    $inc: { view_count: 1 },
  });

  return car as any;
};

const getcarsCountBycreatorId = async (creatorID: string) => {
  const user = await User.findById(creatorID);
  if (!user) {
    return { message: 'User not found' }; // More relevant message
  }

  // Count the number of cars created by this user
  const createdCarCount = await CarModel.countDocuments({ creatorID });

  // Determine the remaining car limit
  const carsRemaining =
    user.freeLimit > 0 ? user.freeLimit : user.carCreateLimit;

  // Fetch all cars created by this user with populated brand and model data
  const allCars = await CarModel.find({ creatorID })
    .populate('brand')
    .populate('model');

  // Return the results
  return {
    createdCarCount,
    carsRemaining,
    allCars,
    carCreateLimit: carsRemaining, // Include carCreateLimit for reference
  };
};

const updatecars = async (
  id: string,
  payload: Partial<ICar>,
  files: any,
): Promise<ICar | null> => {
  let newImages: { url: string; key: string }[] = [];
  let newBannerImages: { url: string; key: string }[] = [];

  if (files) {
    const { images, bannerImage } = files as UploadedFiles;

    // Handle regular images
    if (images?.length) {
      const imgsArray: { file: any; path: string; key?: string }[] = [];
      for (const image of images) {
        imgsArray.push({
          file: image,
          path: `images/car/images/${Math.floor(100000 + Math.random() * 900000)}`,
        });
      }
      newImages = await uploadManyToS3(imgsArray);
    }

    // Handle banner images
    if (bannerImage?.length) {
      const bannerImgsArray: { file: any; path: string; key?: string }[] = [];
      for (const image of bannerImage) {
        bannerImgsArray.push({
          file: image,
          path: `images/car/banner/${Math.floor(100000 + Math.random() * 900000)}`,
        });
      }
      newBannerImages = await uploadManyToS3(bannerImgsArray);
    }
  }

  // Fetch the existing car data from the database
  const existingCar = await CarModel.findById(id);
  // Ensure existing images are retained if no new images are provided
  // payload.images = [
  //   ...(existingCar?.images || []), // Retain existing images
  //   ...newImages,
  // ];

  payload.images = [
    ...(payload.defaultImages || existingCar?.images || []),
    ...newImages,
  ];

  // Update the bannerImage field
  payload.bannerImage = newBannerImages.length
    ? newBannerImages
    : existingCar?.bannerImage || []; // Retain existing bannerImage if no new one is provided

  // Update the car in the database
  const car = await CarModel.findByIdAndUpdate(
    id,
    {
      ...payload,
    },
    { runValidators: true, new: true }, // Return the updated document
  );

  return car;
};

const getBestDeals = async () => {
  const currentDate = new Date();
  const lastWeekDate = new Date(currentDate.setDate(currentDate.getDate() - 7)); // 7 days ago

  // Get cars that were listed in the last 7 days and have high view count
  const bestDeals = await CarModel.find({
    createdAt: { $gte: lastWeekDate }, // Cars listed in the last 7 days
  })
    .populate('brand')
    .populate('model')
    .populate('creatorID')
    .sort({ view_count: -1 })
    .limit(6);

  return bestDeals;
};

const deletecars = async (id: string): Promise<void> => {
  const car = await CarModel.findByIdAndDelete(id);
  if (!car) {
    throw new AppError(httpStatus.NOT_FOUND, 'Car not found');
  }
};

const getCarViewsByYear = async (userId: string, year: string) => {
  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
  const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);

  const carViewsByMonth = await CarModel.aggregate([
    {
      $match: {
        creatorID: new Types.ObjectId(userId), // Ensure userId is treated as ObjectId
        createdAt: { $gte: startOfYear, $lte: endOfYear },
      },
    },
    {
      $addFields: {
        view_count: { $ifNull: ['$view_count', 0] }, // Handle missing or null view_count
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' }, // Group by month
        totalViews: { $sum: '$view_count' }, // Sum the views
      },
    },
    {
      $project: {
        month: '$_id', // Month number
        totalViews: 1,
        _id: 0,
      },
    },
    {
      $sort: { month: 1 }, // Sort by month
    },
  ]);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Map month numbers to readable month names and fill missing months with 0 views
  const formattedResult = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const monthData = carViewsByMonth.find(entry => entry.month === month);
    return {
      month: monthNames[index],
      totalViews: monthData ? monthData.totalViews : 0,
    };
  });

  return formattedResult;
};

const getMostWantedCars = async (): Promise<ICar[]> => {
  const mostWantedCars = await CarModel.find({
    isMostWanted: true,
  })

  return mostWantedCars;
};

export const carsService = {
  createcars,
  getAllcars,
  getcarsById,
  updatecars,
  deletecars,
  getcarsCountBycreatorId,
  getCarViewsByYear,
  getcarsByCreatorId,
  getBestDeals,
  getMostWantedCars,
};
