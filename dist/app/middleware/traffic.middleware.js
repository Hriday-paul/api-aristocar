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
exports.trackPageVisit = void 0;
const traffic_service_1 = require("../modules/traffic/traffic.service");
const uuid_1 = require("uuid"); // To generate a unique userId
const trackPageVisit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let userId = req.cookies.userId;
    if (!userId) {
        userId = (0, uuid_1.v4)();
        res.cookie('userId', userId, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });
    }
    const pageUrl = req.originalUrl;
    try {
        yield traffic_service_1.trafficService.incrementTraffic(pageUrl, userId);
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.trackPageVisit = trackPageVisit;
