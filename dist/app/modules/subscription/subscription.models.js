"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the Mongoose schema
const SubscriptionsSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    package: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Package', required: true },
    isPaid: { type: Boolean, default: false },
    trnId: { type: String, default: null },
    amount: { type: Number, required: true, min: 0 },
    expiredAt: { type: Date, default: null },
    isExpired: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
SubscriptionsSchema.pre('find', function (next) {
    //@ts-ignore
    this.find({ isDeleted: { $ne: true } });
    next();
});
SubscriptionsSchema.pre('findOne', function (next) {
    //@ts-ignore
    this.find({ isDeleted: { $ne: true } });
    next();
});
SubscriptionsSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
// Create and export the model
const Subscription = (0, mongoose_1.model)('Subscriptions', SubscriptionsSchema);
exports.default = Subscription;
