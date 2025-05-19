import { Types } from 'mongoose';

export interface IMessage {
  _id: Types.ObjectId;
  sender: Types.ObjectId; // References User
  recipient: Types.ObjectId; // References User
  content: string;
  createdAt: Date;
}
