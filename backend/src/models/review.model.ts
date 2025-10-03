import { Schema, model, Document, Types } from "mongoose";

export interface IReview extends Document {
  book: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;
  text?: string;
}

const ReviewSchema = new Schema<IReview>(
  {
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String },
  },
  { timestamps: true }
);

export default model<IReview>("Review", ReviewSchema);
