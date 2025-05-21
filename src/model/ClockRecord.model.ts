import { v4 as uuidV4 } from 'uuid';
import mongoose, { Schema, Document } from 'mongoose';

export interface IClockRecord extends Document {
    _id: string;
    id: string,
    agentId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
    clockIn: Date;
    clockOut?: Date;
    createdAt: Date;
    status: boolean,
    softDelete: boolean,
}

const ClockRecordSchema: Schema = new Schema(
    {
        id: { type: String, required: true, unique: true, default: uuidV4() },
        agentId: { type: Schema.Types.ObjectId, ref: 'Agent', required: true },
        jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
        clockIn: { type: Date, required: true },
        clockOut: { type: Date },
        createdAt: { type: Date, default: Date.now },
        status: { type: Boolean, default: true },
        softDelete: { type: Boolean, default: false }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export const ClockRecordModel = mongoose.model<IClockRecord>('ClockRecord', ClockRecordSchema);