import { v4 as uuidV4 } from 'uuid';
import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    _id: string;
    id: string,
    userId: mongoose.Types.ObjectId;
    content: string;
    type: 'JobUpdate' | 'Message' | 'System';
    read: boolean;
    createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true, default: uuidV4() },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ['JobUpdate', 'Message', 'System'], required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
},
    {
        timestamps: true,
        versionKey: false
    }
);

export const NotificationModel = mongoose.model<INotification>('Notification', NotificationSchema);