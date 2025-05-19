import { v4 as uuidV4 } from 'uuid';
import mongoose, { Schema, Document } from 'mongoose';

export interface ICountry extends Document {
    _id: string;
    id: string,
    name: string; // Country name, e.g., "United States"
    code: string; // ISO country code, e.g., "US"
    currency: string,
    createdAt: Date;
    updatedAt: Date;
}

const CountrySchema: Schema = new Schema(
    {
        id: { type: String, required: false, unique: true, default: uuidV4() },
        name: { type: String, required: true, toUpperCase: true, unique: true },
        code: { type: String, required: true, unique: true, match: /^[A-Z]{2}$/ }, // ISO 3166-1 alpha-2 code
        currency: { type: String, required: true }
    },
    { timestamps: true, versionKey: false }
);

export const CountryModel = mongoose.model<ICountry>('Country', CountrySchema);