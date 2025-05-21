import { v4 as uuidV4 } from 'uuid';
import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
    _id: string,
    id: string,
    name: string;
    isGroupChat: boolean;
    lastMessage?: mongoose.Types.ObjectId;
    participants: mongoose.Types.ObjectId[];
    admin?: mongoose.Types.ObjectId;
    status: boolean,
    softDelete: boolean,
    createdAt: Date;
    updatedAt: Date;
}

const ChatSchema: Schema = new Schema(
    {
        id: { type: String, required: true, unique: true, default: uuidV4() },
        name: {
            type: String,
            required: true,
        },
        isGroupChat: {
            type: Boolean,
            default: false,
        },
        lastMessage: {
            type: Schema.Types.ObjectId,
            ref: 'ChatMessage', // Or 'Message' if you're using MessageModel
        },
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        ],
        admin: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        status: { type: Boolean, default: true },
        softDelete: { type: Boolean, default: false }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export const ChatModel = mongoose.model<IChat>('Chat', ChatSchema);
