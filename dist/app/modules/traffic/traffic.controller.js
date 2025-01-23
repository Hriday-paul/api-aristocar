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
exports.trafficController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const traffic_service_1 = require("./traffic.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const getAllSTraffic = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield traffic_service_1.trafficService.getAllTrafficStats();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'All subscriptions fetched successfully',
        data: result,
    });
}));
// Get traffic stats for a specific day or all data if no day is provided
const getTrafficForDay = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date } = req.params;
    if (!date) {
        // If no date is provided, return all traffic data
        const trafficStats = yield traffic_service_1.trafficService.getAllTrafficStats();
        return res.status(200).json({
            success: true,
            data: trafficStats,
        });
    }
    // Parse the date from the request
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
            success: false,
            message: 'Invalid date format.',
        });
    }
    const trafficStats = yield traffic_service_1.trafficService.getTrafficByDay(parsedDate);
    res.status(200).json({
        success: true,
        data: trafficStats,
    });
}));
// Get traffic stats for a specific month or all data if no month is provided
const getTrafficForMonth = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { year, month } = req.params;
    if (!year || !month) {
        // If no year or month is provided, return all traffic data
        const trafficStats = yield traffic_service_1.trafficService.getAllTrafficStats();
        return res.status(200).json({
            success: true,
            data: trafficStats,
        });
    }
    const yearInt = parseInt(year, 10);
    const monthInt = parseInt(month, 10);
    if (isNaN(yearInt) || isNaN(monthInt)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid year or month format.',
        });
    }
    const trafficStats = yield traffic_service_1.trafficService.getTrafficByMonth(yearInt, monthInt);
    res.status(200).json({
        success: true,
        data: trafficStats,
    });
}));
// Get traffic stats for a specific year or all data if no year is provided
const getTrafficForYear = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { year } = req.params;
    if (!year) {
        // If no year is provided, return all traffic data
        const trafficStats = yield traffic_service_1.trafficService.getAllTrafficStats();
        return res.status(200).json({
            success: true,
            data: trafficStats,
        });
    }
    const yearInt = parseInt(year, 10);
    if (isNaN(yearInt)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid year format.',
        });
    }
    const trafficStats = yield traffic_service_1.trafficService.getTrafficByYear(yearInt);
    res.status(200).json({
        success: true,
        data: trafficStats,
    });
}));
exports.trafficController = {
    getTrafficForDay,
    getTrafficForMonth,
    getTrafficForYear,
    getAllSTraffic
};
