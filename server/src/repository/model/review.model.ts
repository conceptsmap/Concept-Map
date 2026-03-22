import mongoose, { Schema } from "mongoose";
import { IReview } from "../../types/model";

const ReviewSchema: Schema = new Schema(
  {
    reviewer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    script_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Script",
      required: true,
    },
    payment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Purchase",
      required: true,
      unique: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: true },
);

const ReviewModel = mongoose.model<IReview>("Review", ReviewSchema);
export default ReviewModel;
