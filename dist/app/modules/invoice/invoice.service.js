"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const invoice_models_1 = __importDefault(require("./invoice.models"));
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
const getAllInvoices = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const invoiceQuery = new QueryBuilder_1.default(invoice_models_1.default.find(), query)
        .search(['invoiceNumber', 'userId'])
        .filter()
        .paginate()
        .sort();
    const data = yield invoiceQuery.modelQuery;
    const meta = yield invoiceQuery.countTotal();
    return { data, meta };
});
const getInvoiceById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const invoiceData = yield invoice_models_1.default
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
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Invoice not found');
    }
    return invoiceData;
});
const getInvoicesByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const invoices = yield invoice_models_1.default.find({ userId });
    if (!invoices.length) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No invoices found for the user');
    }
    return invoices;
});
const updateInvoice = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedInvoice = yield invoice_models_1.default.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!updatedInvoice) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Invoice not found to update');
    }
    return updatedInvoice;
});
const deleteInvoice = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedInvoice = yield invoice_models_1.default.findByIdAndDelete(id);
    if (!deletedInvoice) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Invoice not found to delete');
    }
    return deletedInvoice;
});
exports.invoiceService = {
    // createInvoice,
    getAllInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice,
    getInvoicesByUserId,
};
