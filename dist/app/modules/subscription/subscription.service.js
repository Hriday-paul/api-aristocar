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
exports.subscriptionService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const packages_models_1 = __importDefault(require("../packages/packages.models"));
const subscription_models_1 = __importDefault(require("./subscription.models"));
const mongoose_1 = require("mongoose");
const user_models_1 = require("../user/user.models");
const user_constants_1 = require("../user/user.constants");
const createSubscription = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('insdie create subscription');
    // Check if a similar subscription exists
    const isExist = yield subscription_models_1.default.findOne({
        user: payload.user,
        package: payload.package,
        isPaid: false,
    });
    if (isExist) {
        return isExist;
    }
    // Find the package details
    const packages = yield packages_models_1.default.findById(payload.package);
    const user = yield user_models_1.User.findById(payload.user);
    if (!packages) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Package not found');
    }
    // Check user role and approval status
    if ((user === null || user === void 0 ? void 0 : user.role) === user_constants_1.USER_ROLE.dealer && !user.isApproved) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Dealer account is not approved by admin');
    }
    // Set the subscription amount
    payload.amount = packages.price;
    // Calculate the expiration date based on the package duration
    if (user === null || user === void 0 ? void 0 : user.durationDay) {
        const currentDate = new Date();
        const durationInMilliseconds = user.durationDay * 24 * 60 * 60 * 1000; // Convert days to milliseconds
        payload.expiredAt = new Date(currentDate.getTime() + durationInMilliseconds); // Calculate expiration date
        console.log('Current Date:', payload.expiredAt);
    }
    // Create the subscription
    const result = yield subscription_models_1.default.create(payload);
    // console.log('result:', result);
    if (!result) {
        throw new Error('Failed to create subscription');
    }
    return result;
});
const getAllSubscription = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const subscriptionsModel = new QueryBuilder_1.default(subscription_models_1.default.find().populate(['package', 'user']), query)
        .search([])
        .filter()
        .paginate()
        .sort()
        .fields();
    subscriptionsModel.modelQuery =
        subscriptionsModel.modelQuery.sort('createdAt');
    const data = yield subscriptionsModel.modelQuery;
    const meta = yield subscriptionsModel.countTotal();
    return {
        data,
        meta,
    };
});
const getSubscriptionById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscription_models_1.default.findOne({
        user: userId,
        isPaid: true,
    })
        .populate(['package', 'user'])
        .sort('-createdAt');
    // return [result];
    return result ? [result] : [];
});
const getSubscriptionByUserId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscription_models_1.default.find({
        user: new mongoose_1.Types.ObjectId(id),
    }).populate(['package', 'user']);
    return result;
});
const updateSubscription = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscription_models_1.default.findByIdAndUpdate(id, payload, {
        new: true,
    });
    if (!result) {
        throw new Error('Failed to update subscription');
    }
    return result;
});
const deleteSubscription = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscription_models_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!result) {
        throw new Error('Failed to delete subscription');
    }
    return result;
});
exports.subscriptionService = {
    createSubscription,
    getAllSubscription,
    getSubscriptionById,
    updateSubscription,
    deleteSubscription,
    getSubscriptionByUserId,
};
