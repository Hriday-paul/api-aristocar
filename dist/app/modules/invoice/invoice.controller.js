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
exports.invoiceController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const invoice_service_1 = require("./invoice.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const user_models_1 = require("../user/user.models");
const payments_models_1 = __importDefault(require("../payments/payments.models"));
const invoice_utils_1 = require("./invoice.utils");
const invoice_models_1 = __importDefault(require("./invoice.models"));
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
const createInvoice = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { subscriptionId } = req.body;
    if (!userId || !subscriptionId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User ID and Subscription ID are required');
    }
    console.log('Request Body:', req.body);
    // Fetch user data for VAT validation
    const user = yield user_models_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const vatAmount = user.vat_status === 'valid' && user.vat_type === 'Romania' ? 0.19 : 0;
    // Fetch payment data
    const paymentData = yield payments_models_1.default.findOne({
        user: userId,
        subscription: subscriptionId,
    });
    if (!paymentData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Payment not found for the provided user and subscription ID');
    }
    const amount = parseFloat(paymentData.amount);
    const vatValue = parseFloat((amount * vatAmount).toFixed(2));
    const totalAmount = parseFloat((amount - vatValue).toFixed(2));
    // Prepare invoice data
    const invoiceData = {
        userId,
        paymentId: paymentData._id,
        subscriptionId,
        invoiceDate: new Date(),
        invoiceNumber: (0, invoice_utils_1.generateUniqueInvoiceNumber)(),
        vatAmount: vatValue.toString(),
        totalAmount: totalAmount.toString(),
    };
    console.log('Invoice Data:', invoiceData);
    // Create invoice
    const newInvoice = yield invoice_models_1.default.create(invoiceData);
    if (!newInvoice) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to create invoice');
    }
    // Populate and return the newly created invoice with all details based on userId
    const fullInvoiceData = yield invoice_models_1.default
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
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No invoices found for the user');
    }
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Invoice created and fetched successfully',
        data: fullInvoiceData,
    });
}));
exports.default = createInvoice;
const getAllInvoices = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield invoice_service_1.invoiceService.getAllInvoices(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Invoices retrieved successfully',
        data: result.data,
        meta: result.meta,
    });
}));
const getInvoiceById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield invoice_service_1.invoiceService.getInvoiceById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Invoice retrieved successfully',
        data: result,
    });
}));
const getInvoicesByUserId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield invoice_service_1.invoiceService.getInvoicesByUserId(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Invoices retrieved successfully',
        data: result,
    });
}));
const updateInvoice = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield invoice_service_1.invoiceService.updateInvoice(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Invoice updated successfully',
        data: result,
    });
}));
const deleteInvoice = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield invoice_service_1.invoiceService.deleteInvoice(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Invoice deleted successfully',
        data: result,
    });
}));
exports.invoiceController = {
    createInvoice,
    getAllInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice,
    getInvoicesByUserId,
};
