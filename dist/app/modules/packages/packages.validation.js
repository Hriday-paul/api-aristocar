"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.packageValidator = void 0;
const zod_1 = __importDefault(require("zod"));
const createPackageValidator = zod_1.default.object({
    body: zod_1.default.object({
        title: zod_1.default
            .string({ required_error: 'Title is required' })
            .min(1, 'Title cannot be empty'),
        shortTitle: zod_1.default
            .string({ required_error: 'Short title is required' })
            .min(1, 'Short title cannot be empty'),
        shortDescription: zod_1.default
            .string({ required_error: 'Short description is required' })
            .min(1, 'Short description cannot be empty'),
        price: zod_1.default
            .number({ required_error: 'Price is required' })
            .min(0, 'Price must be a non-negative number'),
        durationDay: zod_1.default
            .number({ required_error: 'Total classes are required' })
            .min(0, 'Total classes must be a non-negative number'),
    }),
});
const updatePackageValidator = zod_1.default.object({
    body: zod_1.default
        .object({
        title: zod_1.default
            .string({ required_error: 'Title is required' })
            .min(1, 'Title cannot be empty'),
        shortTitle: zod_1.default
            .string({ required_error: 'Short title is required' })
            .min(1, 'Short title cannot be empty'),
        shortDescription: zod_1.default
            .string({ required_error: 'Short description is required' })
            .min(1, 'Short description cannot be empty'),
        price: zod_1.default
            .number({ required_error: 'Price is required' })
            .min(0, 'Price must be a non-negative number'),
        durationDay: zod_1.default
            .number({ required_error: 'Total classes are required' })
            .min(0, 'Total classes must be a non-negative number'),
    })
        .deepPartial(),
});
exports.packageValidator = {
    createPackageValidator,
    updatePackageValidator,
};
