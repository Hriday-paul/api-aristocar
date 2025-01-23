import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { brandsService } from './brands.service';
import sendResponse from '../../utils/sendResponse';

const createbrands = catchAsync(async (req: Request, res: Response) => {
  const result = await brandsService.createbrands(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Brand created successfully',
    data: result,
  });
});

const getAllbrands = catchAsync(async (req: Request, res: Response) => {
  const result = await brandsService.getAllbrands(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All brands fetched successfully',
    data: result,
  });
});

const getbrandsById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await brandsService.getbrandsById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Brand fetched successfully',
    data: result,
  });
});

const updatebrands = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await brandsService.updatebrands(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Brand updated successfully',
    data: result,
  });
});

const deletebrands = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await brandsService.deletebrands(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Brand deleted successfully',
    data: null,
  });
});

export const brandsController = {
  createbrands,
  getAllbrands,
  getbrandsById,
  updatebrands,
  deletebrands,
};