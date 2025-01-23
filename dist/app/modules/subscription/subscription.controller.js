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
exports.subscriptionController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const subscription_service_1 = require("./subscription.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const createSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    req.body.user = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield subscription_service_1.subscriptionService.createSubscription(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Subscription created successfully',
        data: result,
    });
}));
const getAllSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscription_service_1.subscriptionService.getAllSubscription(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'All subscriptions fetched successfully',
        data: result,
    });
}));
const getMySubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield subscription_service_1.subscriptionService.getSubscriptionByUserId((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'All subscriptions fetched successfully',
        data: result,
    });
}));
const getSubscriptionById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield subscription_service_1.subscriptionService.getSubscriptionById(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Subscription fetched successfully',
        data: result,
    });
}));
const getSubscriptionByUserId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscription_service_1.subscriptionService.getSubscriptionByUserId(req.params.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Subscription fetched successfully',
        data: result,
    });
}));
const updateSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscription_service_1.subscriptionService.updateSubscription(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Subscription updated successfully',
        data: result,
    });
}));
const deleteSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscription_service_1.subscriptionService.deleteSubscription(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Subscription deleted successfully',
        data: result,
    });
}));
exports.subscriptionController = {
    createSubscription,
    getAllSubscription,
    getSubscriptionById,
    getSubscriptionByUserId,
    updateSubscription,
    deleteSubscription,
    getMySubscription,
};
