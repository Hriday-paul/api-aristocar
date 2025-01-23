import { Document } from 'mongoose';

// Define the interface for the Traffic schema
export interface ITraffic extends Document {
  pageUrl: string;
  visits: number;
  dailyVisits: number;
  monthlyVisits: number;
  yearlyVisits: number;
  visitors: Map<string, Date>;
  lastUpdated: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
