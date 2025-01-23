import mongoose, { Error, Query, Schema, model } from 'mongoose';
import config from '../../config';
import bcrypt from 'bcrypt';
import { Role, USER_ROLE } from '../user/user.constants';
import { ICar } from './cars.interface';

const CarSchema: Schema<ICar> = new Schema(
  {
    name: { type: String, required: true },
    details: { type: String, required: true },
    images: {
      type: [
        {
          url: { type: String },
          key: { type: String },
        },
      ],
      default: [],
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'brand',
      required: true,
    },
    model: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Model',
      required: true,
    },
    country: { type: String, required: true },
    price: { type: Number, required: true },
    power: { type: Number, required: true },
    powerUnit: {
      type: String,
      enum: ['Horsepower', 'Kilowatt'],
      required: true,
    },
    mileage: { type: Number, required: true },
    mileageUnit: { type: String, enum: ['KM', 'Miles'], required: true },
    Drive: { type: String, enum: ['LHD', 'RHD'], required: true },
    YearOfManufacture: { type: Number, required: true },
    vin: { type: String, required: true },
    bodyStyle: { type: [String], required: true },
    interiorColor: { type: [String], required: true },
    exteriorColor: { type: [String], required: true },
    fuelType: { type: [String], required: true },
    creatorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    view_count: { type: Number, default: 0 },
    bannerImage: {
      type: [
        {
          url: { type: String },
          key: { type: String },
        },
      ],
      default: [],
    },
    discription: { type: String },
    isMostWanted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export const CarModel = mongoose.model<ICar>('Car', CarSchema);
