import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { contactService } from './contact.service';
import sendResponse from '../../utils/sendResponse';

const createcontact = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  req.body.userId = userId;

  // console.log('======', req.body);
  const result = await contactService.createContact(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Message sent successfully',
    data: result,
  });
});

const getAllcontact = catchAsync(async (req: Request, res: Response) => {
  const result = await contactService.getAllcontact(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contacts retrieved successfully',
    data: result,
  });
});

const getcontactById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await contactService.getcontactById(id);
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

const getcontactByUserId = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await contactService.getcontactByUserId(userId);
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

const updatecontact = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await contactService.updatecontact(id, req.body);
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
const deletecontact = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await contactService.deletecontact(id);
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

export const contactController = {
  createcontact,
  getAllcontact,
  getcontactById,
  updatecontact,
  deletecontact,
  getcontactByUserId,
};
