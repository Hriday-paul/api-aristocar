import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { invoiceService } from './invoice.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { User } from '../user/user.models';
import Payment from '../payments/payments.models';
import { generateUniqueInvoiceNumber } from './invoice.utils';
import invoice from './invoice.models';

// const createInvoice = catchAsync(async (req: Request, res: Response) => {
//   const userId = req.user?.userId;
//   req.body.userId = userId;
//   const result = await invoiceService.createInvoice(req.body);
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Invoice created successfully',
//     data: result,
//   });
// });

const createInvoice = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { subscriptionId } = req.body;
  if (!userId || !subscriptionId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'User ID and Subscription ID are required',
    );
  }
  console.log('Request Body:', req.body);
  // Fetch user data for VAT validation
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const vatAmount =
    user.vat_status === 'valid' && user.vat_type === 'Romania' ? 0.19 : 0;

  // Fetch payment data
  const paymentData = await Payment.findOne({
    user: userId,
    subscription: subscriptionId,
  });
  if (!paymentData) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Payment not found for the provided user and subscription ID',
    );
  }

  const amount = parseFloat(paymentData.amount as any);
  const vatValue = parseFloat((amount * vatAmount).toFixed(2));
  const totalAmount = parseFloat((amount - vatValue).toFixed(2));

  // Prepare invoice data
  const invoiceData = {
    userId,
    paymentId: paymentData._id,
    subscriptionId,
    invoiceDate: new Date(),
    invoiceNumber: generateUniqueInvoiceNumber(),
    vatAmount: vatValue.toString(),
    totalAmount: totalAmount.toString(),
  };

  console.log('Invoice Data:', invoiceData);
  // Create invoice
  const newInvoice = await invoice.create(invoiceData);
  if (!newInvoice) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create invoice',
    );
  }

  // Populate and return the newly created invoice with all details based on userId
  const fullInvoiceData = await invoice
    .find({ userId })
    .populate({
      path: 'userId',
      select: '-password',
    })
    .populate({
      path: 'paymentId',
      populate: [
        {
          path: 'subscription',
          populate: {
            path: 'package',
          },
        },
      ],
    });

  if (!fullInvoiceData || fullInvoiceData.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No invoices found for the user');
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Invoice created and fetched successfully',
    data: fullInvoiceData,
  });
});

export default createInvoice;

const getAllInvoices = catchAsync(async (req: Request, res: Response) => {
  const result = await invoiceService.getAllInvoices(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Invoices retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getInvoiceById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await invoiceService.getInvoiceById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Invoice retrieved successfully',
    data: result,
  });
});

const getInvoicesByUserId = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await invoiceService.getInvoicesByUserId(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Invoices retrieved successfully',
    data: result,
  });
});

const updateInvoice = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await invoiceService.updateInvoice(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Invoice updated successfully',
    data: result,
  });
});

const deleteInvoice = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await invoiceService.deleteInvoice(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Invoice deleted successfully',
    data: result,
  });
});

export const invoiceController = {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  getInvoicesByUserId,
};
