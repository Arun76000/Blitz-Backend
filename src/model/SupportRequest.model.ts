import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';

export interface ISupportRequest extends Document {
    _id: string;
    id: string,
    userId: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    message: string;
    requestStatus: 'Open' | 'InProgress' | 'Resolved';
    status: boolean,
    soft_delete: boolean,
    createdAt: Date;
    updatedAt: Date;
}

const SupportRequestSchema: Schema = new Schema(
    {
        id: { type: String, required: true, unique: true, default: uuidV4() },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        message: { type: String, required: true },
        requestStatus: { type: String, enum: ['Open', 'InProgress', 'Resolved'], default: 'Open' },
        status: { type: Boolean, default: true },
        soft_delete: { type: Boolean, default: false }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export const SupportRequestModel = mongoose.model<ISupportRequest>('SupportRequest', SupportRequestSchema);