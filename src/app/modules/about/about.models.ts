import mongoose, { Schema } from 'mongoose';
import { IAbout } from './about.interface';

// import { Schema } from 'zod';

const AboutSchema: Schema<IAbout> = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const About = mongoose.model<IAbout>('About', AboutSchema);
export default About;
