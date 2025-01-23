import mongoose, { Schema } from 'mongoose';
import { Imodel } from './models.interface';

const ModelSchema: Schema<Imodel> = new mongoose.Schema({
  modelName: {
    type: String,
    required: true,
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'brand',
    required: true,
  },
});

const Model = mongoose.model('Model', ModelSchema);

export default Model;
