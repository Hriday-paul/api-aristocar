"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Traffic = void 0;
const mongoose_1 = require("mongoose");
const TrafficSchema = new mongoose_1.Schema({
    pageUrl: { type: String, required: true, unique: true },
    visits: { type: Number, required: true, default: 0 },
    dailyVisits: { type: Number, required: true, default: 0 },
    monthlyVisits: { type: Number, required: true, default: 0 },
    yearlyVisits: { type: Number, required: true, default: 0 },
    visitors: { type: Map, of: Date, required: true },
    lastUpdated: { type: Date, required: true },
}, { timestamps: true });
exports.Traffic = (0, mongoose_1.model)('Traffic', TrafficSchema);
