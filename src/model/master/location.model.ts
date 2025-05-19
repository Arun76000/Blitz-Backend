import { v4 as uuidV4 } from 'uuid';
import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
  _id: string;
  id: string;
  name: string;
  cityId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, default: uuidV4 },
    name: { type: String, required: true },
    cityId: { type: Schema.Types.ObjectId, ref: 'City', required: true },
  },
  { timestamps: true, versionKey: false },
);

// Ensure uniqueness of location name within a city
LocationSchema.index({ name: 1, cityId: 1 }, { unique: true });

export const LocationModel = mongoose.model<ILocation>('Location', LocationSchema);
