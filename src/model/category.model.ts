import { v4 as uuidV4 } from 'uuid';
import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    _id: string;
    id: string;
    name: string;
    parentId: string;
    isSub: boolean;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
    {
        id: { type: String, required: true, unique: true, default: uuidV4 },
        name: { type: String, required: true, unique: true },
        parentId: { type: Schema.Types.ObjectId, ref: 'Category', required: false, default: null },
        isSub: { type: Boolean, required: false, default: false },
        description: { type: String },
    },
    { timestamps: true, versionKey: false },
);

export const CategoryModel = mongoose.model<ICategory>('Category', CategorySchema);
