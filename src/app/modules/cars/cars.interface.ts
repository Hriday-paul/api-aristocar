// src/interfaces/CarInterface.ts

import mongoose, { ObjectId, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export type PowerUnit = 'Horsepower' | 'Kilowatt';
export type MileageUnit = 'KM' | 'Miles';
export type Drive = 'LHD' | 'RHD';

interface IImage {
  url: string;
  key: string;
}
export interface ICar {
  name: string;
  details: string;
  images: IImage[];
  defaultImages: IImage[];
  brand: object;
  model: object;
  country: string;
  price: number;
  power: number;
  powerUnit: PowerUnit;
  mileage: number;
  mileageUnit: MileageUnit;
  Drive: Drive;
  YearOfManufacture: number;
  vin: string;
  bodyStyle: string[];
  interiorColor: string[];
  exteriorColor: string[];
  fuelType: string[];
  creatorID: ObjectId | IUser;
  view_count: number;
  bannerImage: IImage[];
  discription: string;
  isMostWanted: boolean;
}

export interface udIcar extends ICar {
  defaultImages: { key: string; url: string }[];
}
