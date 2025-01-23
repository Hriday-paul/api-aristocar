"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the Mongoose schema
const PaymentSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    subscription: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Subscriptions',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    tranId: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
PaymentSchema.pre('find', function (next) {
    //@ts-ignore
    this.find({ isDeleted: { $ne: true } });
    next();
});
PaymentSchema.pre('findOne', function (next) {
    //@ts-ignore
    this.find({ isDeleted: { $ne: true } });
    next();
});
PaymentSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
// Create and export the model
const Payment = (0, mongoose_1.model)('Payment', PaymentSchema);
exports.default = Payment;
