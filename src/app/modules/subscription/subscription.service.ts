import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import Package from '../packages/packages.models';
import { ISubscriptions } from './subscription.interface';
import Subscription from './subscription.models';
import { Types } from 'mongoose';

const createSubscription = async (payload: ISubscriptions) => {
  console.log('insdie create subscription');
  // Check if a similar subscription exists
  const isExist = await Subscription.findOne({
    user: payload.user,
    package: payload.package,
    isPaid: false,
  });

  if (isExist) {
    return isExist;
  }

  // Find the package details
  const packages = await Package.findById(payload.package);

  if (!packages) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Package not found');
  }

  // Set the subscription amount
  payload.amount = packages.price;

  // Calculate the expiration date based on the package duration
  if (packages.durationDay) {
    const currentDate = new Date();
    payload.expiredAt = new Date(
      currentDate.getTime() + packages.durationDay * 24 * 60 * 60 * 1000,
    ); // Add duration in milliseconds
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Package duration not specified',
    );
  }

  // Create the subscription
  const result = await Subscription.create(payload);

  if (!result) {
    throw new Error('Failed to create subscription');
  }

  return result;
};

const getAllSubscription = async (query: Record<string, any>) => {
  const subscriptionsModel = new QueryBuilder(
    Subscription.find().populate(['package', 'user']),
    query,
  )
    .search([])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await subscriptionsModel.modelQuery;
  const meta = await subscriptionsModel.countTotal();
  return {
    data,
    meta,
  };
};

const getSubscriptionById = async (userId: string) => {
  const result = await Subscription.find({ user: userId }).populate([
    'package',
    'user',
  ]);
  // if (!result) {
  //   throw new Error('Subscription not found');
  // }
  return result;
};

const getSubscriptionByUserId = async (id: string) => {
  const result = await Subscription.find({
    user: new Types.ObjectId(id),
  }).populate(['package', 'user']);

  return result;
};

const updateSubscription = async (
  id: string,
  payload: Partial<ISubscriptions>,
) => {
  const result = await Subscription.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new Error('Failed to update subscription');
  }
  return result;
};

const deleteSubscription = async (id: string) => {
  const result = await Subscription.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new Error('Failed to delete subscription');
  }
  return result;
};

export const subscriptionService = {
  createSubscription,
  getAllSubscription,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
  getSubscriptionByUserId,
};
