import { Schema, model } from 'mongoose';
import { ITraffic } from './traffic.interface';

const TrafficSchema: Schema<ITraffic> = new Schema(
  {
    pageUrl: { type: String, required: true, unique: true },
    visits: { type: Number, required: true, default: 0 },
    dailyVisits: { type: Number, required: true, default: 0 },
    monthlyVisits: { type: Number, required: true, default: 0 },
    yearlyVisits: { type: Number, required: true, default: 0 },
    visitors: { type: Map, of: Date, required: true },
    lastUpdated: { type: Date, required: true },
  },
  { timestamps: true },
);

export const Traffic = model<ITraffic>('Traffic', TrafficSchema);
