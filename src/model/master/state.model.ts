import { v4 as uuidV4 } from 'uuid';
import mongoose, { Schema, Document } from 'mongoose';

export interface IState extends Document {
    _id: string;
    id:string,
    name: string; // State name, e.g., "California"
    code: string; // State code, e.g., "CA"
    countryId: mongoose.Types.ObjectId; // Reference to Country
    createdAt: Date;
    updatedAt: Date;
}

const StateSchema: Schema = new Schema(
    {
        id: { type: String, required: true, unique: true, default: uuidV4() },
        name: { type: String, required: true },
        code: { type: String, required: true, match: /^[A-Z]{2}$/ }, // State code, e.g., "CA"
        countryId: { type: Schema.Types.ObjectId, ref: 'Country', required: true },
    },
    { timestamps: true, versionKey: false }
);

// Ensure uniqueness of state name within a country
StateSchema.index({ name: 1, countryId: 1 }, { unique: true });

export const StateModel = mongoose.model<IState>('State', StateSchema);