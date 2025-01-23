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
exports.userService = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const user_models_1 = require("./user.models");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const user_constants_1 = require("./user.constants");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield user_models_1.User.isUserExist(payload.email);
    if (isExist) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'User already exists with this email');
    }
    // If the user is registering as a dealer, set isApproved to false
    if (payload.role === user_constants_1.USER_ROLE.dealer) {
        payload.isApproved = false; // Dealer accounts need admin approval
    }
    if (payload === null || payload === void 0 ? void 0 : payload.isGoogleLogin) {
        payload.verification = {
            otp: 0,
            expiresAt: new Date(Date.now()),
            status: true,
        };
    }
    if (!payload.isGoogleLogin && !payload.password) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Password is required');
    }
    if (payload.role === user_constants_1.USER_ROLE.dealer &&
        (!payload.companyName || !payload.dealership)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Company name and dealership are required for dealer role.');
    }
    const user = yield user_models_1.User.create(payload);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User creation failed');
    }
    // Optionally, notify the admin for approval (if the user is a dealer)
    // if (payload.role === USER_ROLE.dealer) {
    //   sendAdminNotification(payload);
    // }
    return user;
});
const getAllUser = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const userModel = new QueryBuilder_1.default(user_models_1.User.find(), query)
        .search(['name', 'email', 'phoneNumber', 'status'])
        .filter()
        .paginate()
        .sort();
    const data = yield userModel.modelQuery;
    const meta = yield userModel.countTotal();
    return {
        data,
        meta,
    };
});
const geUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_models_1.User.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    return result;
});
const getAllDealerRequests = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_models_1.User.find({ role: user_constants_1.USER_ROLE.dealer, isApproved: false });
});
const handleDealerRequest = (dealerId, isApproved) => __awaiter(void 0, void 0, void 0, function* () {
    const dealer = yield user_models_1.User.findById(dealerId);
    if (!dealer || dealer.role !== user_constants_1.USER_ROLE.dealer) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Dealer request not found');
    }
    if (isApproved) {
        dealer.isApproved = true;
    }
    else {
        dealer.isApproved = false;
        dealer.role = user_constants_1.USER_ROLE.user;
    }
    yield dealer.save();
    return dealer;
});
const updateUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_models_1.User.findByIdAndUpdate(id, payload, { new: true });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User updating failed');
    }
    return user;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_models_1.User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'user deleting failed');
    }
    return user;
});
exports.userService = {
    createUser,
    getAllUser,
    geUserById,
    updateUser,
    deleteUser,
    getAllDealerRequests,
    handleDealerRequest,
};
