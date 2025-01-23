import { z } from 'zod';

export const createModelZodSchema = z.object({
  body: z.object({
    modelName: z
      .string()
      .min(1, 'Model name is required')
      .max(100, 'Model name must be less than 100 characters'),
    brandId: z.string().min(1, 'Brand ID is required'),
  }),
});
