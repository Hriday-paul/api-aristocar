"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
const user_constants_1 = require("./user.constants");
const guestValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'name is required' }),
        email: zod_1.z
            .string({ required_error: 'Email is required' })
            .email({ message: 'Invalid email address' }),
        role: zod_1.z.enum([...user_constants_1.Role]).default(user_constants_1.USER_ROLE.user),
        password: zod_1.z.string({ required_error: 'Password is required' }),
    }),
});
exports.userValidation = {
    guestValidationSchema,
};
