"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTrafficZodSchema = void 0;
const zod_1 = require("zod");
exports.createTrafficZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        pageUrl: zod_1.z
            .string()
            .min(1, 'Page URL is required')
            .max(2000, 'Page URL must be less than 2000 characters')
            .url('Invalid URL format'),
        visits: zod_1.z
            .number()
            .min(0, 'Visits cannot be negative')
            .int('Visits must be an integer')
            .default(0),
    }),
});
