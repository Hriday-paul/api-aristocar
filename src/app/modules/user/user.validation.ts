import { z } from 'zod';
import { Role, USER_ROLE } from './user.constants';

const guestValidationSchema = z.object({
  body: z
    .object({
      name: z.string({ required_error: 'Name is required' }),
      email: z
        .string({ required_error: 'Email is required' })
        .email({ message: 'Invalid email address' }),
      role: z.enum([...Role] as [string, ...string[]]).default(USER_ROLE.user),
      isGoogleLogin: z.boolean().default(false),
      password: z
        .string()
        .optional()
        .or(z.literal(null)), // Allow `null` for password if `isGoogleLogin` is true
    })
    .refine(
      (data) => {
        // If `isGoogleLogin` is false, ensure password is provided
        if (!data.isGoogleLogin && !data.password) {
          return false;
        }
        return true;
      },
      {
        message: 'Password is required when not using Google login',
        path: ['password'], // Path to the field causing the error
      }
    ),
});

export const userValidation = {
  guestValidationSchema,
};
