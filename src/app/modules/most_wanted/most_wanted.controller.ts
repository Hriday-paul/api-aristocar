import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { mostWantedService } from './most_wanted.service';
import sendResponse from '../../utils/sendResponse';
import { uploadToS3 } from '../../utils/s3';
import httpStatus from 'http-status';

const createMostWanted = catchAsync(async (req: Request, res: Response) => {
  if (req.file) {
    req.body.image = await uploadToS3({
      file: req.file, // Ensure it's req.file for a single file
      fileName: `images/mostwanted/cars/${Math.floor(100000 + Math.random() * 900000)}`,
    });
  }
  const result = await mostWantedService.createMostWanted(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Most wanted entry created successfully',
    data: result,
  });
});

const getAllMostWanted = catchAsync(async (req: Request, res: Response) => {
  const mostWanted = await mostWantedService.getAllMostWanted(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All most wanted entries fetched successfully',
    data: { mostWanted },
  });
});

const getMostWantedById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await mostWantedService.getMostWantedById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Most wanted entry fetched successfully',
    data: result,
  });
});

const updateMostWanted = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await mostWantedService.updateMostWanted(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Most wanted entry updated successfully',
    data: result,
  });
});

const deleteMostWanted = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await mostWantedService.deleteMostWanted(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Most wanted entry deleted successfully',
    data: null,
  });
});

export const mostWantedController = {
  createMostWanted,
  getAllMostWanted,
  getMostWantedById,
  updateMostWanted,
  deleteMostWanted,
};
