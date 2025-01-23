"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContactZodSchema = void 0;
const zod_1 = require("zod");
exports.createContactZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z
            .string()
            .min(1, 'First name is required')
            .max(50, 'First name must be less than 50 characters'),
        lastName: zod_1.z
            .string()
            .min(1, 'Last name is required')
            .max(50, 'Last name must be less than 50 characters'),
        email: zod_1.z
            .string()
            .email('Invalid email address')
            .min(1, 'Email is required'),
        description: zod_1.z
            .string()
            .min(1, 'Description is required')
            .max(500, 'Description must be less than 500 characters'),
    }),
});
