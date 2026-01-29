import mongoose, { Schema } from "mongoose";
import { IPurschase, PaymentMethod } from "../../types/model";

const PurchaseSchema: Schema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    script_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Script",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    payment_method: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    payment_status: {
      type: String,
      enum: ["COMPLETED", "FAILED", "PENDING"],
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    transaction_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const PurchaseModel = mongoose.model<IPurschase>("Purchase", PurchaseSchema);

export default PurchaseModel;
