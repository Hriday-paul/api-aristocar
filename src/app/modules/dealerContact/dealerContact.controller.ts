import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import DealerContact from './dealerContact.models';
import { dealerContactService } from './dealerContact.service';
import httpStatus from 'http-status';
import AppError from '../../error/AppError';

const createdealerContact = catchAsync(async (req: Request, res: Response) => {
  const result = await dealerContactService.createdealerContact(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Message send successfully',
    data: result,
  });
});

const getAlldealerContact = catchAsync(async (req: Request, res: Response) => {
  const result = await dealerContactService.getAlldealerContact(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contacts retrieved successfully',
    data: result,
  });
});

const getdealerContactById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await dealerContactService.getdealerContactById(id);
  if (!result) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: 'Contact not found',
      data: {},
    });
  } else {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Contact retrieved successfully',
      data: result,
    });
  }
});

const getDealerContact = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
  }
  const count = await dealerContactService.getDealerContact(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created cars count retrieved successfully',
    data: count,
  });
});

const updatedealerContact = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await dealerContactService.updatedealerContact(id, req.body);
  if (!result) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: 'Contact not found to update',
      data: {},
    });
  } else {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Contact updated successfully',
      data: result,
    });
  }
});
const deletedealerContact = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await dealerContactService.deletedealerContact(id);
  if (!result) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: 'Contact not found to delete',
      data: {},
    });
  } else {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Contact deleted successfully',
      data: result,
    });
  }
});

export const dealerContactController = {
  createdealerContact,
  getAlldealerContact,
  getdealerContactById,
  updatedealerContact,
  deletedealerContact,
  getDealerContact,
};
