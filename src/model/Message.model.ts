import { v4 as uuidV4 } from 'uuid';
import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  _id: string;
  id: string,
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  content: string;
  timestamp: Date;
  read: boolean;
  status: boolean,
  softDelete: boolean,
}

const MessageSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, default: uuidV4() },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
    softDelete: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);