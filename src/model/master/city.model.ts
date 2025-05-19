import { v4 as uuidV4 } from 'uuid';
import mongoose, { Schema, Document } from 'mongoose';

export interface ICity extends Document {
    _id: string;
    id: string,
    name: string; // City name, e.g., "Los Angeles"
    stateId: mongoose.Types.ObjectId; // Reference to State
    createdAt: Date;
    updatedAt: Date;
}

const CitySchema: Schema = new Schema(
    {
        id: { type: String, required: true, unique: true, default: uuidV4() },
        name: { type: String, required: true },
        stateId: { type: Schema.Types.ObjectId, ref: 'State', required: true },
    },
    { timestamps: true, versionKey: false }
);

// Ensure uniqueness of city name within a state
CitySchema.index({ name: 1, stateId: 1 }, { unique: true });

export const CityModel = mongoose.model<ICity>('City', CitySchema);