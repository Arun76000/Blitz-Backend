import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  role: 'agency' | 'agent' | 'admin';
  agencyName?: string;
  agencyType?: string;
  firstName?: string;
  lastName?: string;
  appliedJobs?: Types.ObjectId[];
  postedJobs?: Types.ObjectId[];
}


export interface IAgent {
  _id: Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  appliedJobs?: Types.ObjectId[];
  role: 'agent';
}



export interface IAgency {
  _id: Types.ObjectId;
  email: string;
  password: string;
  agencyName: string;
  agencyType: string;
  jobs?: Types.ObjectId[];
  role: 'agency';
}