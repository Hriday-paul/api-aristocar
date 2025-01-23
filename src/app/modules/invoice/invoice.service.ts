import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import Payment from '../payments/payments.models';
import invoice from './invoice.models';
import { Iinvoice } from './invoice.interface';
import { generateUniqueInvoiceNumber } from './invoice.utils';

// const createInvoice = async (payload: Iinvoice) => {
//   const { userId,subscriptionId } = payload;
//   const vatAmount = '';
//   const paymentData = await Payment.findOne({ user: userId && subscription: subscriptionId});
//   if (!paymentData) {
//     throw new AppError(
//       httpStatus.NOT_FOUND,
//       'Payment not found for the provided user ID',
//     );
//   }
//   const amount = parseFloat(paymentData.amount as any);
//   const totalAmount = parseFloat((amount - parseFloat(vatAmount)).toFixed(2));

//   const invoiceData = {
//     userId,
//     paymentId: paymentData._id,
//     invoiceDate: new Date(),
//     invoiceNumber: generateUniqueInvoiceNumber(),
//     vatAmount: vatAmount.toString(),
//     totalAmount: totalAmount.toString(),
//   };

//   const newInvoice = await invoice.create(invoiceData);
//   if (!newInvoice) {
//     throw new AppError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       'Failed to create invoice',
//     );
//   }
//   return newInvoice;
// };

const getAllInvoices = async (query: Record<string, any>) => {
  const invoiceQuery = new QueryBuilder(invoice.find(), query)
    .search(['invoiceNumber', 'userId'])
    .filter()
    .paginate()
    .sort();

  const data = await invoiceQuery.modelQuery;
  const meta = await invoiceQuery.countTotal();

  return { data, meta };
};

const getInvoiceById = async (id: string) => {
  const invoiceData = await invoice
    .findById(id)
    .populate({
      path: 'userId', // Populate userId directly from the invoice
      select: '-password', // Exclude the password field
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

  if (!invoiceData) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invoice not found');
  }
  return invoiceData;
};

const getInvoicesByUserId = async (userId: string) => {
  const invoices = await invoice.find({ userId });
  if (!invoices.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'No invoices found for the user');
  }
  return invoices;
};

const updateInvoice = async (id: string, payload: Partial<Iinvoice>) => {
  const updatedInvoice = await invoice.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedInvoice) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invoice not found to update');
  }
  return updatedInvoice;
};

const deleteInvoice = async (id: string) => {
  const deletedInvoice = await invoice.findByIdAndDelete(id);
  if (!deletedInvoice) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invoice not found to delete');
  }
  return deletedInvoice;
};

export const invoiceService = {
  // createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  getInvoicesByUserId,
};
