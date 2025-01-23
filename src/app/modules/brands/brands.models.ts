import mongoose, { Error, Query, Schema, model } from 'mongoose';
import { Ibrand } from './brands.interface';
// import { Schema } from 'zod';

const BrandsSchema: Schema<Ibrand> = new Schema(
  {
    brandName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const brand = mongoose.model<Ibrand>('brand', BrandsSchema);
export default brand;