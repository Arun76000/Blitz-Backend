import { v4 as uuidV4 } from 'uuid';
import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
    _id: string;
    id: string,
    agentId: mongoose.Types.ObjectId; // Reference to User (agent)
    agencyId: mongoose.Types.ObjectId; // Reference to User (agency)
    jobId: mongoose.Types.ObjectId; // Reference to Job
    applicationStatus: 'Applied' | 'Reviewed' | 'Interview' | 'Hired' | 'Rejected' | 'Cancelled'; // Application status
    appliedAt: Date; // When the agent applied
    updatedAt: Date; // Last update to the application
    applicationDetails?: {
        coverLetter?: string; // Optional cover letter submitted by agent
        additionalNotes?: string; // Optional notes from agent
    };
    statusHistory: { status: string; timestamp: Date }[]; // Track status changes
    status: boolean,
    softDelete: boolean,
}

const ApplicationSchema: Schema = new Schema(
    {
        id: { type: String, required: true, unique: true, default: uuidV4() },
        agentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        agencyId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
        applicationStatus: {
            type: String,
            enum: ['Applied', 'Reviewed', 'Interview', 'Hired', 'Rejected', 'Cancelled'],
            default: 'Applied',
        },
        appliedAt: { type: Date, default: Date.now },
        applicationDetails: {
            coverLetter: { type: String },
            additionalNotes: { type: String },
        },
        statusHistory: [
            {
                status: { type: String, required: true },
                timestamp: { type: Date, default: Date.now },
            },
        ],
        status: { type: Boolean, default: true },
        softDelete: { type: Boolean, default: false }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Ensure the statusHistory is updated whenever the status changes
ApplicationSchema.pre('save', function (this: IApplication, next) {
    if (this.isModified('status')) {
        this.statusHistory.push({ status: this.applicationStatus, timestamp: new Date() });
    }
    next();
});

// Ensure uniqueness of agent applying to the same job
ApplicationSchema.index({ agentId: 1, jobId: 1 }, { unique: true });

export const ApplicationModel = mongoose.model<IApplication>('Application', ApplicationSchema);