import { z } from 'zod';

export const createTrafficZodSchema = z.object({
  body: z.object({
    pageUrl: z
      .string()
      .min(1, 'Page URL is required')
      .max(2000, 'Page URL must be less than 2000 characters')
      .url('Invalid URL format'),
    visits: z
      .number()
      .min(0, 'Visits cannot be negative')
      .int('Visits must be an integer')
      .default(0),
  }),
});
