import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import About from './about.models';

// Create About
const createabout = catchAsync(async (req: Request, res: Response) => {
  const { description } = req.body;
  const newAbout = await About.create({ description });
  res.status(201).json({
    status: 'success',
    data: newAbout,
  });
});

// Get All About
const getAllabout = catchAsync(async (req: Request, res: Response) => {
  const aboutList = await About.find();
  res.status(200).json({
    status: 'success',
    data: aboutList,
  });
});

// Get About by ID
const getaboutById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const about = await About.findById(id);
  if (!about) {
    return res.status(404).json({
      status: 'fail',
      message: 'About not found',
    });
  }
  res.status(200).json({
    status: 'success',
    data: about,
  });
});

// Update About
const updateabout = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { description } = req.body;
  const updatedAbout = await About.findByIdAndUpdate(
    id,
    { description },
    { new: true },
  );
  if (!updatedAbout) {
    return res.status(404).json({
      status: 'fail',
      message: 'About not found',
    });
  }
  res.status(200).json({
    status: 'success',
    data: updatedAbout,
  });
});

// Delete About
const deleteabout = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedAbout = await About.findByIdAndDelete(id);
  if (!deletedAbout) {
    return res.status(404).json({
      status: 'fail',
      message: 'About not found',
    });
  }
  res.status(204).json({
    status: 'success',
    message: 'About record deleted successfully',
  });
});

export const aboutController = {
  createabout,
  getAllabout,
  getaboutById,
  updateabout,
  deleteabout,
};
