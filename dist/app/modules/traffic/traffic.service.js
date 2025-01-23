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
Object.defineProperty(exports, "__esModule", { value: true });
exports.trafficService = exports.getAllTrafficStats = exports.getTrafficByYear = exports.getTrafficByMonth = exports.getTrafficByDay = exports.incrementTraffic = exports.isSameYear = exports.isSameMonth = exports.isSameDay = void 0;
const traffic_models_1 = require("./traffic.models");
// Helper functions for date comparison
const isSameDay = (date1, date2) => date1.toDateString() === date2.toDateString();
exports.isSameDay = isSameDay;
const isSameMonth = (date1, date2) => date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();
exports.isSameMonth = isSameMonth;
const isSameYear = (date1, date2) => date1.getFullYear() === date2.getFullYear();
exports.isSameYear = isSameYear;
const incrementTraffic = (pageUrl, userId) => __awaiter(void 0, void 0, void 0, function* () {
    let trafficData = yield traffic_models_1.Traffic.findOne({ pageUrl });
    const now = new Date();
    if (!trafficData) {
        trafficData = new traffic_models_1.Traffic({
            pageUrl,
            visits: 1,
            dailyVisits: 1,
            monthlyVisits: 1,
            yearlyVisits: 1,
            visitors: { [userId]: now },
            lastUpdated: now,
        });
    }
    else {
        if (!(0, exports.isSameDay)(now, trafficData.lastUpdated)) {
            trafficData.dailyVisits = 1;
        }
        else {
            trafficData.dailyVisits += 1;
        }
        if (!(0, exports.isSameMonth)(now, trafficData.lastUpdated)) {
            trafficData.monthlyVisits = 1;
        }
        else {
            trafficData.monthlyVisits += 1;
        }
        if (!(0, exports.isSameYear)(now, trafficData.lastUpdated)) {
            trafficData.yearlyVisits = 1;
        }
        else {
            trafficData.yearlyVisits += 1;
        }
        trafficData.visits += 1;
        const lastVisit = trafficData.visitors.get(userId);
        const isUniqueToday = !lastVisit || !(0, exports.isSameDay)(now, lastVisit);
        if (isUniqueToday) {
            trafficData.visitors.set(userId, now);
        }
        trafficData.lastUpdated = now;
    }
    yield trafficData.save();
    return trafficData;
});
exports.incrementTraffic = incrementTraffic;
// Get traffic stats for a specific day
const getTrafficByDay = (date) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield traffic_models_1.Traffic.find({
        lastUpdated: {
            $gte: new Date(date.setHours(0, 0, 0, 0)),
            $lt: new Date(date.setHours(23, 59, 59, 999)),
        },
    });
    const count = yield traffic_models_1.Traffic.countDocuments({
        lastUpdated: {
            $gte: new Date(date.setHours(0, 0, 0, 0)),
            $lt: new Date(date.setHours(23, 59, 59, 999)),
        },
    });
    return { result, count };
});
exports.getTrafficByDay = getTrafficByDay;
// Get traffic stats for a specific month, with count
const getTrafficByMonth = (year, month) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield traffic_models_1.Traffic.find({
        lastUpdated: {
            $gte: new Date(year, month - 1, 1),
            $lt: new Date(year, month, 0, 23, 59, 59, 999),
        },
    });
    const count = yield traffic_models_1.Traffic.countDocuments({
        lastUpdated: {
            $gte: new Date(year, month - 1, 1),
            $lt: new Date(year, month, 0, 23, 59, 59, 999),
        },
    });
    return { result, count };
});
exports.getTrafficByMonth = getTrafficByMonth;
// Get traffic stats for a specific year, with count
const getTrafficByYear = (year) => __awaiter(void 0, void 0, void 0, function* () {
    const trafficData = [];
    for (let month = 0; month < 12; month++) {
        const startOfMonth = new Date(year, month, 1);
        const endOfMonth = new Date(year, month + 1, 1);
        const result = yield traffic_models_1.Traffic.find({
            lastUpdated: {
                $gte: startOfMonth,
                $lt: endOfMonth,
            },
        });
        const count = result.length;
        trafficData.push({
            month: startOfMonth.toLocaleString('default', { month: 'long' }),
            count,
        });
    }
    return trafficData;
});
exports.getTrafficByYear = getTrafficByYear;
// Get all traffic stats
const getAllTrafficStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield traffic_models_1.Traffic.find();
    const count = yield traffic_models_1.Traffic.countDocuments();
    return { result, count };
});
exports.getAllTrafficStats = getAllTrafficStats;
exports.trafficService = {
    incrementTraffic: exports.incrementTraffic,
    getAllTrafficStats: exports.getAllTrafficStats,
    getTrafficByDay: exports.getTrafficByDay,
    getTrafficByMonth: exports.getTrafficByMonth,
    getTrafficByYear: exports.getTrafficByYear,
};
