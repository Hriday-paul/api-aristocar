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
exports.carsController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const cars_service_1 = require("./cars.service");
const fileHelper_1 = require("../../utils/fileHelper");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const cars_models_1 = require("./cars.models");
const subscription_models_1 = __importDefault(require("../subscription/subscription.models"));
const user_models_1 = require("../user/user.models");
const mongoose_1 = require("mongoose");
const createcars = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const subscription = yield subscription_models_1.default.findOne({
        user: new mongoose_1.Types.ObjectId(userId),
        isExpired: false,
        isDeleted: false,
    }).populate('package');
    if (!subscription) {
        const user = yield user_models_1.User.findById(userId);
        const currentDate = new Date();
        if (!(user === null || user === void 0 ? void 0 : user.freeExpairDate) || currentDate > user.freeExpairDate) {
            return (0, sendResponse_1.default)(res, {
                statusCode: http_status_1.default.BAD_REQUEST,
                success: false,
                message: 'Your free car creation period has expired.',
                data: {},
            });
        }
        const createdCarsCount = yield cars_service_1.carsService.getcarsCountBycreatorId(userId);
        if (Number(createdCarsCount) >= (Number(user.freeLimit) || 0)) {
            return (0, sendResponse_1.default)(res, {
                statusCode: http_status_1.default.BAD_REQUEST,
                success: false,
                message: 'You have reached the free car creation limit.',
                data: {},
            });
        }
    }
    else {
        const { expiredAt } = subscription;
        const currentDate = new Date();
        if (!expiredAt || currentDate > expiredAt) {
            subscription.isExpired = true;
            yield subscription.save();
            return (0, sendResponse_1.default)(res, {
                statusCode: http_status_1.default.BAD_REQUEST,
                success: false,
                message: 'Your subscription has expired.',
                data: {},
            });
        }
        const { carCreateLimit } = subscription.package;
        const createdCarsCount = yield cars_models_1.CarModel.countDocuments({
            creatorID: new mongoose_1.Types.ObjectId(userId),
        });
        if (createdCarsCount >= carCreateLimit) {
            return (0, sendResponse_1.default)(res, {
                statusCode: http_status_1.default.BAD_REQUEST,
                success: false,
                message: 'You have reached the car creation limit for your package.',
                data: {},
            });
        }
    }
    req.body.creatorID = userId;
    const result = yield cars_service_1.carsService.createcars(req.body, req.files);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Car created successfully',
        data: { car: result },
    });
}));
const getAllcars = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cars = yield cars_service_1.carsService.getAllcars(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All cars retrieved successfully',
        data: { cars },
    });
}));
const getcarsById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const car = yield cars_service_1.carsService.getcarsById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Car retrieved successfully',
        data: { car },
    });
}));
const getcarsByCreatorId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const car = yield cars_service_1.carsService.getcarsByCreatorId(req.params.creatorID);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Car retrieved successfully',
        data: { car },
    });
}));
const getcarsCountBycreatorId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const creatorID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!creatorID) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User not found');
    }
    const count = yield cars_service_1.carsService.getcarsCountBycreatorId(creatorID);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User created cars count retrieved successfully',
        data: count,
    });
}));
const updatecars = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.files && Array.isArray(req.files)) {
        const uploadedImages = req.files.map(file => (0, fileHelper_1.storeFile)('carpictures', file.filename));
        req.body.images = uploadedImages;
    }
    const car = yield cars_service_1.carsService.updatecars(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Car updated successfully',
        data: { car },
    });
}));
const deletecars = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield cars_service_1.carsService.deletecars(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Car deleted successfully',
        data: null,
    });
}));
const getUserCarViewsByYear = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { year } = req.query;
    if (!year) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: 'Year parameter is required',
            data: {},
        });
    }
    const carViewsByMonth = yield cars_service_1.carsService.getCarViewsByYear(userId, year);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Car views by month for year ${year}`,
        data: carViewsByMonth,
    });
}));
exports.carsController = {
    createcars,
    getAllcars,
    getcarsById,
    updatecars,
    deletecars,
    getcarsCountBycreatorId,
    getUserCarViewsByYear,
    getcarsByCreatorId,
};
