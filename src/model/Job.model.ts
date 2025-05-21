import { v4 as uuidV4 } from 'uuid';
import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  _id: string;
  id: string,
  agencyId: mongoose.Types.ObjectId;
  name: string;
  visibility: 'Public' | 'Private';
  type: 'FullTime' | 'PartTime' | 'Contract';
  rate: number;
  numberOfAgents: number;
  mainCategory: string;
  subCategory: string;
  licenseType: string;
  description: string;
  location: {
    country: string;
    state: string;
    zipcode: string;
    addressLine: string;
  };
  requirementType: 'Mandatory' | 'Optional';
  dressCode: 'Formal' | 'Casual' | 'Uniform';
  startDate: Date;
  closeDate: Date;
  languageRequirements: {
    englishProficiency: 'Basic' | 'Intermediate' | 'Advanced';
    additionalLanguages: { name: string; proficiency: 'Basic' | 'Intermediate' | 'Advanced' }[];
  };
  gender: 'Male' | 'Female' | 'Other';
  payNet: number;
  jobStatus: 'Pending' | 'Approved' | 'Active' | 'Completed';
  appliedAgents: mongoose.Types.ObjectId[];
  hiredAgents: mongoose.Types.ObjectId[];
  status: boolean,
  soft_delete: boolean,
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, default: uuidV4() },
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
    name: { type: String, required: true },
    visibility: { type: String, enum: ['Public', 'Private'], required: true },
    type: { type: String, enum: ['FullTime', 'PartTime', 'Contract'], required: true },
    rate: { type: Number, required: true, min: 0 },
    numberOfAgents: { type: Number, required: true, min: 1 },
    mainCategory: { type: String, required: true },
    subCategory: { type: String, required: true },
    licenseType: { type: String, required: true },
    description: { type: String, required: true },
    location: {
      country: { type: String, required: true },
      state: { type: String, required: true },
      zipcode: { type: String, required: true, match: /^[0-9]{5,10}$/ },
      addressLine: { type: String, required: true },
    },
    requirementType: { type: String, enum: ['Mandatory', 'Optional'], required: true },
    dressCode: { type: String, enum: ['Formal', 'Casual', 'Uniform'], required: true },
    startDate: { type: Date, required: true },
    closeDate: { type: Date, required: true },
    languageRequirements: {
      englishProficiency: { type: String, enum: ['Basic', 'Intermediate', 'Advanced'], required: true },
      additionalLanguages: [
        {
          name: { type: String, required: true },
          proficiency: { type: String, enum: ['Basic', 'Intermediate', 'Advanced'], required: true },
        },
      ],
    },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    payNet: { type: Number, required: true, min: 0 },
    jobStatus: { type: String, enum: ['Pending', 'Approved', 'Active', 'Completed'], default: 'Pending' },
    appliedAgents: [{ type: Schema.Types.ObjectId, ref: 'Agent' }],
    hiredAgents: [{ type: Schema.Types.ObjectId, ref: 'Agent' }],
    status: { type: Boolean, default: true },
    soft_delete: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const JobModel = mongoose.model<IJob>('Job', JobSchema);