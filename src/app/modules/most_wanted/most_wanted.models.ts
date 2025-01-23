import mongoose, { Schema } from 'mongoose';
import { IMostWanted } from './most_wanted.interface';

const MostWantedSchema: Schema<IMostWanted> = new Schema(
  {
    image: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      required: true,
    },
    carId: {
      type: Schema.Types.ObjectId,
      ref: 'Car', // Referencing the Car collection
      required: true,
    },
  },
  { timestamps: true },
);

const MostWanted = mongoose.model<IMostWanted>('MostWanted', MostWantedSchema);
export default MostWanted;
