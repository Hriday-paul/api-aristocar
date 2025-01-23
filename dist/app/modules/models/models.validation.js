"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModelZodSchema = void 0;
const zod_1 = require("zod");
exports.createModelZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        modelName: zod_1.z
            .string()
            .min(1, 'Model name is required')
            .max(100, 'Model name must be less than 100 characters'),
        brandId: zod_1.z.string().min(1, 'Brand ID is required'),
    }),
});
