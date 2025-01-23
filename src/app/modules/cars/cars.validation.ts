// src/validations/CarValidation.ts
import { z } from 'zod';
import { Role, USER_ROLE } from '../user/user.constants';
export const carSchema = z.object({
  name: z.string(),
  details: z.string(),
  brand: z.string(),
  model: z.string(),
  country: z.string(),
  price: z.number().positive(),
  power: z.number().positive(),
  powerUnit: z.enum(['Horsepower', 'Kilowatt']),
  mileage: z.number().positive(),
  mileageUnit: z.enum(['KM', 'Miles']),
  vin: z.string(),
  bodyStyle: z.array(z.string()),
  interiorColor: z.array(z.string()),
  exteriorColor: z.array(z.string()),
  fuelType: z.array(z.string()),
});

export const updateCarSchema = z.object({
  defaultImages: z.array(
    z.object({
      url: z.string(),
      key: z.string(),
      _id: z.string(),
    }),
  ),
  name: z.string(),
  details: z.string(),
  brand: z.string(),
  model: z.string(),
  country: z.string(),
  price: z.number().positive(),
  power: z.number().positive(),
  powerUnit: z.enum(['Horsepower', 'Kilowatt']),
  mileage: z.number().positive(),
  mileageUnit: z.enum(['KM', 'Miles']),
  vin: z.string(),
  bodyStyle: z.array(z.string()),
  interiorColor: z.array(z.string()),
  exteriorColor: z.array(z.string()),
  fuelType: z.array(z.string()),
});
