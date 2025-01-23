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
const createSubscription = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield subscription_models_1.default.findOne({
        user: payload.user,
        package: payload.package,
        isPaid: false,
    });
    if (isExist) {
        return isExist;
    }
    const packages = yield packages_models_1.default.findById(payload.package);
    if (!packages) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Package not found');
    }
    payload.amount = packages.price;
    const result = yield subscription_models_1.default.create(payload);
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
    const data = yield subscriptionsModel.modelQuery;
    const meta = yield subscriptionsModel.countTotal();
    return {
        data,
        meta,
    };
});
const getSubscriptionById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscription_models_1.default.find({ user: userId }).populate([
        'package',
        'user',
    ]);
    // if (!result) {
    //   throw new Error('Subscription not found');
    // }
    return result;
});
const getSubscriptionByUserId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscription_models_1.default.findOne({
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
