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
exports.paymentsController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const payments_service_1 = require("./payments.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const checkout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.user = req.user.userId;
    const result = yield payments_service_1.paymentsService.checkout(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'payment link get successful',
    });
}));
const confirmPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield payments_service_1.paymentsService.confirmPayment(req === null || req === void 0 ? void 0 : req.query);
    // res.redirect(`${config.success_url}?subscriptionId=${results?.subscription}`);
    // sendResponse(res, {
    //   success: true,
    //   statusCode: httpStatus.OK,
    //   data: result,
    //   message: 'payment successful',
    // });
    const result = yield payments_service_1.paymentsService.generateInvoice(req === null || req === void 0 ? void 0 : req.query.paymentId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Payment retrieved successfully',
    });
}));
const dashboardData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payments_service_1.paymentsService.dashboardData(req === null || req === void 0 ? void 0 : req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'dashboard data successful',
    });
}));
const getEarnings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payments_service_1.paymentsService.getEarnings();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'earnings data successful',
    });
}));
const getPaymentsByUserId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield payments_service_1.paymentsService.getPaymentsByUserId(userId, req.query);
    if (!result) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: http_status_1.default.NOT_FOUND,
            message: 'Payment not found',
            data: {},
        });
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Payment retrieved successfully',
    });
}));
const getPaymentsByUserIdWithParams = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield payments_service_1.paymentsService.getPaymentsByUserId(id, req.query);
    if (!result) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: http_status_1.default.NOT_FOUND,
            message: 'Payment not found',
            data: {},
        });
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Payment retrieved successfully',
    });
}));
const getAllPayments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payments_service_1.paymentsService.getAllPayments(); // Assume this service method exists
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'All payments retrieved successfully',
    });
}));
const getPaymentsById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield payments_service_1.paymentsService.getPaymentsById(id); // Assume this service method exists
    if (!result) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: http_status_1.default.NOT_FOUND,
            message: 'Payment not found',
            data: {},
        });
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Payment retrieved successfully',
    });
}));
const generateInvoice = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // console.log(id);
    const result = yield payments_service_1.paymentsService.generateInvoice(id);
    if (!result) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: http_status_1.default.NOT_FOUND,
            message: 'Payment not found',
            data: {},
        });
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Payment retrieved successfully',
    });
}));
const updatePayments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const paymentData = req.body;
    const result = yield payments_service_1.paymentsService.updatePayments(id, paymentData); // Assume this service method exists
    if (!result) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: http_status_1.default.NOT_FOUND,
            message: 'Payment not found',
            data: {},
        });
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Payment updated successfully',
    });
}));
const deletePayments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield payments_service_1.paymentsService.deletePayments(id);
    if (!result) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: http_status_1.default.NOT_FOUND,
            message: 'Payment not found',
            data: {},
        });
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.NO_CONTENT,
        message: 'Payment deleted successfully',
        data: result,
    });
}));
exports.paymentsController = {
    getAllPayments,
    getPaymentsById,
    updatePayments,
    deletePayments,
    confirmPayment,
    checkout,
    dashboardData,
    getEarnings,
    getPaymentsByUserId,
    getPaymentsByUserIdWithParams,
    generateInvoice,
};
