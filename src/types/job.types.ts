import { Types } from 'mongoose';

export interface IJob {
  _id: Types.ObjectId;
  title: string;
  agency: Types.ObjectId; // References User
  status: 'pending' | 'approved' | 'completed';
  jobType: string;
  location: string;
}