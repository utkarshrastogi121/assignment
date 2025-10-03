import { Schema, model, Document } from "mongoose";
import { Types } from "mongoose";

export interface IBook extends Document {
  title: string;
  author: string;
  description?: string;
  coverImage?: string;
  user: Types.ObjectId;
}

const BookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    coverImage: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
export default model<IBook>("Book", BookSchema);
