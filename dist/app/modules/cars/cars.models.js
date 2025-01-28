"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const CarSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    details: { type: String, required: true },
    images: {
        type: [
            {
                url: { type: String },
                key: { type: String },
            },
        ],
        default: [],
        required: true,
    },
    brand: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'brand',
        required: true,
    },
    model: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Model',
        required: true,
    },
    country: { type: String, required: true },
    price: { type: Number, required: true },
    power: { type: Number, required: true },
    powerUnit: {
        type: String,
        enum: ['Horsepower', 'Kilowatt'],
        required: true,
    },
    mileage: { type: Number, required: true },
    mileageUnit: { type: String, enum: ['KM', 'Miles'], required: true },
    Drive: { type: String, enum: ['LHD', 'RHD'], required: true },
    YearOfManufacture: { type: Number, required: true },
    vin: { type: String, required: true },
    bodyStyle: { type: [String], required: true },
    interiorColor: { type: [String], required: true },
    exteriorColor: { type: [String], required: true },
    fuelType: { type: [String], required: true },
    creatorID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    view_count: { type: Number, default: 0 },
    bannerImage: {
        type: [
            {
                url: { type: String },
                key: { type: String },
            },
        ],
        default: [],
    },
    discription: { type: String },
    isMostWanted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
exports.CarModel = mongoose_1.default.model('Car', CarSchema);
