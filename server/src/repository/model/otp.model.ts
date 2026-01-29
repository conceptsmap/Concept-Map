import mongoose, { Schema } from "mongoose";
import { IOtp, VerificationAction } from "../../types/model";

const OtpSchema: Schema = new Schema(
  {
    code: {
      type: Number,
      required: true,
    },
    retry_count: {
      type: Number,
      default: 3,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action_type: {
      type: String,
      enum: Object.values(VerificationAction),
      default: "VERIFY_EMAIL",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const OtpModel = mongoose.model<IOtp>("Otp", OtpSchema);

export default OtpModel;
