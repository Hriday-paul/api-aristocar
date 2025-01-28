import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import brand from './brands.models';
import { Ibrand } from './brands.interface';
import QueryBuilder from '../../builder/QueryBuilder';

const createbrands = async (payload: Ibrand) => {
  const existingBrand = await brand.findOne({ brandName: payload.brandName });
  if (existingBrand) {
    throw new Error('Brand already exists');
  }
  const newBrand = await brand.create(payload);
  return newBrand;
};

const getAllbrands = async (query: Record<string, any>) => {
  const brandModel = new QueryBuilder(brand.find({}), query)
    .search(['brandName'])
    .filter()
    .paginate()
    .sort();

  const data: any = await brandModel.modelQuery;
  const meta = await brandModel.countTotal();

  if (!data || data.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No brands found');
  }

  return {
    data,
  };
};

const getbrandsById = async (id: string) => {
  const brands = await brand.findById(id);
  if (!brands) {
    throw new AppError(httpStatus.NOT_FOUND, 'Brand not found');
  }
  return brands;
};

const getHomeShow = async () => {
  const brands = await brand.find({ isHome: true });
  return brands;
};

const updatebrands = async (id: string, payload: Partial<Ibrand>) => {
  const updatedBrand = await brand.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!updatedBrand) {
    throw new AppError(httpStatus.NOT_FOUND, 'Brand not found');
  }
  return updatedBrand;
};

const deletebrands = async (id: string) => {
  const deletedBrand = await brand.findByIdAndDelete(id);
  if (!deletedBrand) {
    throw new AppError(httpStatus.NOT_FOUND, 'Brand not found');
  }
};

export const brandsService = {
  createbrands,
  getAllbrands,
  getbrandsById,
  updatebrands,
  deletebrands,
  getHomeShow,
};
