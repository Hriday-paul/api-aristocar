import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { IMostWanted } from './most_wanted.interface';
import MostWanted from './most_wanted.models';
import QueryBuilder from '../../builder/QueryBuilder';

const createMostWanted = async (payload: IMostWanted) => {
  const newMostWanted = await MostWanted.create(payload);
  return newMostWanted;
};

// services

const getAllMostWanted = async (query: Record<string, any>) => {
  const isQueryEmpty = Object.keys(query).length === 0;
  let data, meta;

  if (isQueryEmpty) {
    data = await MostWanted.find().populate({
      path: 'carId',
      populate: ['brand', 'model', 'creatorID'],
    });

    const mostWantedModel = new QueryBuilder(MostWanted.find({}), {});
    meta = await mostWantedModel.countTotal();
  } else {
    const { priceRange, mileageRange, YearOfManufactureRange, ...allQuery } =
      query;

    const mostWantedModel = new QueryBuilder(MostWanted.find({}), allQuery)
      .search(['name'])
      .conditionalFilter()
      .sort()
      .paginate()
      .fields();

    data = (await mostWantedModel.modelQuery.populate({
      path: 'carId',
      populate: ['brand', 'model', 'creatorID'],
    })) as IMostWanted[];

    meta = await mostWantedModel.countTotal();
  }

  return { data, meta };
};

const getMostWantedById = async (id: string) => {
  const mostWanted = await MostWanted.findById(id).populate('carId');
  if (!mostWanted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Most wanted entry not found');
  }
  return mostWanted;
};

const updateMostWanted = async (id: string, payload: Partial<IMostWanted>) => {
  const updatedMostWanted = await MostWanted.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!updatedMostWanted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Most wanted entry not found');
  }
  return updatedMostWanted;
};

const deleteMostWanted = async (id: string) => {
  const deletedMostWanted = await MostWanted.findByIdAndDelete(id);
  if (!deletedMostWanted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Most wanted entry not found');
  }
};

export const mostWantedService = {
  createMostWanted,
  getAllMostWanted,
  getMostWantedById,
  updateMostWanted,
  deleteMostWanted,
};
