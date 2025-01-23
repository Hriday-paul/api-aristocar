import { z } from 'zod';

export const createBrandZodSchema = z.object({
  body: z.object({
    brandName: z
      .string()
      .min(1, 'Brand name is required')
      .max(100, 'Brand name must be less than 100 characters'),
  }),
});
