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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.carsService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const cars_models_1 = require("./cars.models");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const s3_1 = require("../../utils/s3");
const mongoose_1 = require("mongoose");
const user_models_1 = require("../user/user.models");
const createcars = (payload, files) => __awaiter(void 0, void 0, void 0, function* () {
    if (files) {
        const { images } = files;
        payload.images = [{ url: '', key: '' }];
        if (images === null || images === void 0 ? void 0 : images.length) {
            const imgsArray = [];
            images === null || images === void 0 ? void 0 : images.map((image) => __awaiter(void 0, void 0, void 0, function* () {
                imgsArray.push({
                    file: image,
                    path: `images/car/images/${Math.floor(100000 + Math.random() * 900000)}`,
                });
            }));
            payload.images = yield (0, s3_1.uploadManyToS3)(imgsArray);
        }
        else {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Upload minimum 1 image');
        }
    }
    else {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Upload minimum 1 image');
    }
    const car = yield cars_models_1.CarModel.create(payload);
    return car;
});
const getAllcars = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const isQueryEmpty = Object.keys(query).length === 0;
    // url?priceRange=10-50&mileageRange=50-100&
    let data, meta;
    if (isQueryEmpty) {
        data = yield cars_models_1.CarModel.find({})
            .populate('brand')
            .populate('model')
            .populate('creatorID');
        // meta = { total: data.length };
        const carsModel = new QueryBuilder_1.default(cars_models_1.CarModel.find({}), {});
        meta = yield carsModel.countTotal();
    }
    else {
        const { priceRange, mileageRange, YearOfManufactureRange } = query, allQuery = __rest(query, ["priceRange", "mileageRange", "YearOfManufactureRange"]);
        const carsModel = new QueryBuilder_1.default(cars_models_1.CarModel.find({}), allQuery)
            .search(['name'])
            .conditionalFilter()
            .sort()
            .rangeFilter('price', priceRange)
            .rangeFilter('mileage', mileageRange)
            .rangeFilter('YearOfManufacture', YearOfManufactureRange)
            .paginate()
            .fields();
        data = (yield carsModel.modelQuery
            .populate('brand')
            .populate('model')
            .populate('creatorID'));
        meta = yield carsModel.countTotal();
    }
    return { data, meta };
});
const getcarsById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const car = yield cars_models_1.CarModel.findById(id)
        .populate('brand')
        .populate('model')
        .populate('creatorID');
    if (!car) {
        return 'No car found';
    }
    yield cars_models_1.CarModel.findByIdAndUpdate(id, {
        $inc: { view_count: 1 },
    });
    return car;
});
const getcarsByCreatorId = (creatorID) => __awaiter(void 0, void 0, void 0, function* () {
    const car = yield cars_models_1.CarModel.find({ creatorID })
        .populate('creatorID')
        .populate('brand')
        .populate('model');
    if (!car) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Car not found');
    }
    yield cars_models_1.CarModel.findByIdAndUpdate(creatorID, {
        $inc: { view_count: 1 },
    });
    return car;
});
const getcarsCountBycreatorId = (creatorID) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_models_1.User.findById(creatorID);
    if (!user) {
        return { message: 'User not found' }; // More relevant message
    }
    // Count the number of cars created by this user
    const createdCarCount = yield cars_models_1.CarModel.countDocuments({ creatorID });
    // Determine the remaining car limit
    const carsRemaining = user.freeLimit > 0 ? user.freeLimit : user.carCreateLimit;
    // Fetch all cars created by this user with populated brand and model data
    const allCars = yield cars_models_1.CarModel.find({ creatorID })
        .populate('brand')
        .populate('model');
    // Return the results
    return {
        createdCarCount,
        carsRemaining,
        allCars,
        carCreateLimit: carsRemaining, // Include carCreateLimit for reference
    };
});
const updatecars = (id, payload, files) => __awaiter(void 0, void 0, void 0, function* () {
    let newImages = [];
    let newBannerImages = [];
    if (files) {
        const { images, bannerImage } = files;
        // Handle regular images
        if (images === null || images === void 0 ? void 0 : images.length) {
            const imgsArray = [];
            for (const image of images) {
                imgsArray.push({
                    file: image,
                    path: `images/car/images/${Math.floor(100000 + Math.random() * 900000)}`,
                });
            }
            newImages = yield (0, s3_1.uploadManyToS3)(imgsArray);
        }
        // Handle banner images
        if (bannerImage === null || bannerImage === void 0 ? void 0 : bannerImage.length) {
            const bannerImgsArray = [];
            for (const image of bannerImage) {
                bannerImgsArray.push({
                    file: image,
                    path: `images/car/banner/${Math.floor(100000 + Math.random() * 900000)}`,
                });
            }
            newBannerImages = yield (0, s3_1.uploadManyToS3)(bannerImgsArray);
        }
    }
    // Fetch the existing car data from the database
    const existingCar = yield cars_models_1.CarModel.findById(id);
    // Ensure existing images are retained if no new images are provided
    // payload.images = [
    //   ...(existingCar?.images || []), // Retain existing images
    //   ...newImages,
    // ];
    payload.images = [
        ...(payload.defaultImages || (existingCar === null || existingCar === void 0 ? void 0 : existingCar.images) || []),
        ...newImages,
    ];
    // Update the bannerImage field
    payload.bannerImage = newBannerImages.length
        ? newBannerImages
        : (existingCar === null || existingCar === void 0 ? void 0 : existingCar.bannerImage) || []; // Retain existing bannerImage if no new one is provided
    // Update the car in the database
    const car = yield cars_models_1.CarModel.findByIdAndUpdate(id, Object.assign({}, payload), { runValidators: true, new: true });
    return car;
});
const getBestDeals = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = new Date();
    const lastWeekDate = new Date(currentDate.setDate(currentDate.getDate() - 7)); // 7 days ago
    // Get cars that were listed in the last 7 days and have high view count
    const bestDeals = yield cars_models_1.CarModel.find({
        createdAt: { $gte: lastWeekDate }, // Cars listed in the last 7 days
    })
        .populate('brand')
        .populate('model')
        .populate('creatorID')
        .sort({ view_count: -1 })
        .limit(10);
    return bestDeals;
});
const deletecars = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const car = yield cars_models_1.CarModel.findByIdAndDelete(id);
    if (!car) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Car not found');
    }
});
const getCarViewsByYear = (userId, year) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'User not authenticated');
    }
    const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);
    const carViewsByMonth = yield cars_models_1.CarModel.aggregate([
        {
            $match: {
                creatorID: new mongoose_1.Types.ObjectId(userId), // Ensure userId is treated as ObjectId
                createdAt: { $gte: startOfYear, $lte: endOfYear },
            },
        },
        {
            $addFields: {
                view_count: { $ifNull: ['$view_count', 0] }, // Handle missing or null view_count
            },
        },
        {
            $group: {
                _id: { $month: '$createdAt' }, // Group by month
                totalViews: { $sum: '$view_count' }, // Sum the views
            },
        },
        {
            $project: {
                month: '$_id', // Month number
                totalViews: 1,
                _id: 0,
            },
        },
        {
            $sort: { month: 1 }, // Sort by month
        },
    ]);
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    // Map month numbers to readable month names and fill missing months with 0 views
    const formattedResult = Array.from({ length: 12 }, (_, index) => {
        const month = index + 1;
        const monthData = carViewsByMonth.find(entry => entry.month === month);
        return {
            month: monthNames[index],
            totalViews: monthData ? monthData.totalViews : 0,
        };
    });
    return formattedResult;
});
const getMostWantedCars = () => __awaiter(void 0, void 0, void 0, function* () {
    const mostWantedCars = yield cars_models_1.CarModel.find({
        isMostWanted: true,
    }).limit(6);
    if (!mostWantedCars.length) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No most wanted cars found');
    }
    return mostWantedCars;
});
exports.carsService = {
    createcars,
    getAllcars,
    getcarsById,
    updatecars,
    deletecars,
    getcarsCountBycreatorId,
    getCarViewsByYear,
    getcarsByCreatorId,
    getBestDeals,
    getMostWantedCars,
};
