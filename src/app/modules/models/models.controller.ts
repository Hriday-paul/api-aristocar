import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import brand from '../brands/brands.models';
import { modelsService } from './models.service';
import sendResponse from '../../utils/sendResponse';

const createmodels = catchAsync(async (req: Request, res: Response) => {
  const result = await modelsService.createmodels(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Model created successfully',
    data: result,
  });
});

export const getModelsByBrand = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await modelsService.getModelsByBrand(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Models fetched successfully',
      data: result,
    });
  },
);

const getAllmodels = catchAsync(async (req: Request, res: Response) => {
  const result = await modelsService.getAllmodels(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All models fetched successfully',
    data: result,
  });
});

const getmodelsById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await modelsService.getmodelsById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Model fetched successfully',
    data: result,
  });
});

const updatemodels = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await modelsService.updatemodels(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Model updated successfully',
    data: result,
  });
});

const deletemodels = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await modelsService.deletemodels(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Model deleted successfully',
    data: null,
  });
});

export const modelsController = {
  createmodels,
  getAllmodels,
  getmodelsById,
  updatemodels,
  deletemodels,
  getModelsByBrand,
};
