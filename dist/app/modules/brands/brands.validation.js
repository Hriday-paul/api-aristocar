"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBrandZodSchema = void 0;
const zod_1 = require("zod");
exports.createBrandZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        brandName: zod_1.z
            .string()
            .min(1, 'Brand name is required')
            .max(100, 'Brand name must be less than 100 characters'),
    }),
});
