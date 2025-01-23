"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PackageSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    shortTitle: { type: String },
    shortDescription: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    carCreateLimit: { type: Number, required: true, min: 0 },
    durationDay: {
        type: Number,
        required: true,
        min: 1,
    },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
PackageSchema.pre('find', function (next) {
    //@ts-ignore
    this.find({ isDeleted: { $ne: true } });
    next();
});
PackageSchema.pre('findOne', function (next) {
    //@ts-ignore
    this.find({ isDeleted: { $ne: true } });
    next();
});
PackageSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
const Package = (0, mongoose_1.model)('Package', PackageSchema);
exports.default = Package;
