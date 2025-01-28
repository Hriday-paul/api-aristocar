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
const user_models_1 = require("../user/user.models");
const user_constants_1 = require("../user/user.constants");
const createcars = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    // Fetch the user from the database
    const user = yield user_models_1.User.findById(userId);
    if (!user) {
        return res.status(http_status_1.default.NOT_FOUND).json({
            success: false,
            message: 'User not found',
        });
    }
    if (user.role === user_constants_1.USER_ROLE.dealer && !user.isApproved) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Dealer account is not approved by admin');
    }
    // Check if the user has valid limits to create cars
    const currentDate = new Date();
    let canCreateCar = false;
    if (user.freeExpairDate &&
        currentDate <= user.freeExpairDate &&
        user.freeLimit > 0) {
        canCreateCar = true; // Free limit is valid
    }
    else if (user.carCreateLimit &&
        user.carCreateLimit > 0 &&
        user.durationDay) {
        canCreateCar = true; // Paid limit is valid
    }
    if (!canCreateCar) {
        return res.status(http_status_1.default.FORBIDDEN).json({
            success: false,
            message: 'You have reached your car creation limit',
        });
    }
    // Create the car
    req.body.creatorID = userId;
    const result = yield cars_service_1.carsService.createcars(req.body, req.files);
    // Deduct the limit after car creation
    if (user.freeExpairDate && currentDate <= user.freeExpairDate) {
        user.freeLimit -= 1; // Deduct from free limit
    }
    else if (user.carCreateLimit && user.carCreateLimit > 0) {
        user.carCreateLimit -= 1; // Deduct from paid limit
    }
    // Save the updated user data
    yield user.save();
    // Send the response
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
const getBestDeals = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bestDeals = yield cars_service_1.carsService.getBestDeals();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Best deals retrieved successfully',
        data: { bestDeals },
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
        // Check for banner image
        if (req.files &&
            'bannerImage' in req.files &&
            Array.isArray(req.files['bannerImage'])) {
            const uploadedBannerImages = req.files['bannerImage'].map(file => (0, fileHelper_1.storeFile)('carbanner', file.filename));
            req.body.bannerImage = uploadedBannerImages; // Store banner images
        }
        req.body.images = uploadedImages;
    }
    const car = yield cars_service_1.carsService.updatecars(req.params.id, req.body, req.files);
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
        data: {},
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
const getMostWantedCars = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cars = yield cars_service_1.carsService.getMostWantedCars();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Most wanted cars retrieved successfully',
        data: cars,
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
    getBestDeals,
    getMostWantedCars,
};
