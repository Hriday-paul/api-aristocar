import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import brand from '../brands/brands.models';
import { Imodel } from './models.interface';
import Model from './models.models';
import QueryBuilder from '../../builder/QueryBuilder';

const createmodels = async (payload: Imodel) => {
  const brands = await brand.findById(payload.brandId);
  if (!brands) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Brand not found');
  }
  const newModel = await Model.create(payload);
  return newModel;
};

export const getModelsByBrand = async (brandId: string) => {
  const brands = await brand.findById(brandId);
  if (!brands) {
    throw new Error('Brand not found');
  }
  const models = await Model.find({ brandId: brandId }).populate('brandId');

  return {
    brands,
    models,
  };
};
const getAllmodels = async (query: Record<string, any>) => {
  const modelQuery = new QueryBuilder(
    Model.find({}).populate('brandId'),
    query,
  ).search(['modelName']);

  const data: any = await modelQuery.modelQuery;
  const meta = await modelQuery.countTotal();

  if (!data || data.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No models found');
  }

  return {
    data,
  };
};

const getmodelsById = async (id: string) => {
  const model = await Model.findById(id).populate('brand');
  if (!model) {
    throw new Error('Model not found');
  }
  return model;
};

const updatemodels = async (id: string, payload: Partial<Imodel>) => {
  const model = await Model.findByIdAndUpdate(id, payload, {
    new: true,
  }).populate('brand');
  if (!model) {
    throw new Error('Model not found');
  }
  return model;
};

const deletemodels = async (id: string) => {
  const model = await Model.findByIdAndDelete(id);
  if (!model) {
    throw new Error('Model not found');
  }
};

export const modelsService = {
  createmodels,
  getAllmodels,
  getmodelsById,
  updatemodels,
  deletemodels,
  getModelsByBrand,
};
