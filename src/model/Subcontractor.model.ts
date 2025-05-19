import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';

export interface ISubcontractor extends Document {
    _id: string;
    id: string,
    photo?: string;
    name: string;
    address: {
        country: string;
        state: string;
        zipcode: string;
        addressLine: string;
    };
    description?: string;
    contactInfo: {
        phone: string;
        email: string;
    };
}

const SubcontractorSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true, default: uuidV4() },
    photo: { type: String },
    name: { type: String, required: true },
    address: {
        country: { type: String, required: true },
        state: { type: String, required: true },
        zipcode: { type: String, required: true, match: /^[0-9]{5,10}$/ },
        addressLine: { type: String, required: true },
    },
    description: { type: String },
    contactInfo: {
        phone: { type: String, required: true },
        email: { type: String, required: true },
    },
},
    {
        timestamps: true,
        versionKey: false
    });

export const SubcontractorModel = mongoose.model<ISubcontractor>('Subcontractor', SubcontractorSchema);