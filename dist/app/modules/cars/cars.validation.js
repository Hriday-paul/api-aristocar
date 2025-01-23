"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.carSchema = void 0;
// src/validations/CarValidation.ts
const zod_1 = require("zod");
exports.carSchema = zod_1.z.object({
    name: zod_1.z.string(),
    details: zod_1.z.string(),
    brand: zod_1.z.string(),
    model: zod_1.z.string(),
    country: zod_1.z.string(),
    price: zod_1.z.number().positive(),
    power: zod_1.z.number().positive(),
    powerUnit: zod_1.z.enum(['Horsepower', 'Kilowatt']), // Validation for power unit
    mileage: zod_1.z.number().positive(),
    mileageUnit: zod_1.z.enum(['KM', 'Miles']), // Validation for mileage unit
    vin: zod_1.z.string(),
    bodyStyle: zod_1.z.array(zod_1.z.string()),
    interiorColor: zod_1.z.array(zod_1.z.string()),
    exteriorColor: zod_1.z.array(zod_1.z.string()),
    fuelType: zod_1.z.array(zod_1.z.string()),
});
