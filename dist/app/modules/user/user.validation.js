"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
const user_constants_1 = require("./user.constants");
const guestValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        name: zod_1.z.string({ required_error: 'Name is required' }),
        email: zod_1.z
            .string({ required_error: 'Email is required' })
            .email({ message: 'Invalid email address' }),
        role: zod_1.z.enum([...user_constants_1.Role]).default(user_constants_1.USER_ROLE.user),
        isGoogleLogin: zod_1.z.boolean().default(false),
        password: zod_1.z
            .string()
            .optional()
            .or(zod_1.z.literal(null)), // Allow `null` for password if `isGoogleLogin` is true
    })
        .refine((data) => {
        // If `isGoogleLogin` is false, ensure password is provided
        if (!data.isGoogleLogin && !data.password) {
            return false;
        }
        return true;
    }, {
        message: 'Password is required when not using Google login',
        path: ['password'], // Path to the field causing the error
    }),
});
exports.userValidation = {
    guestValidationSchema,
};
