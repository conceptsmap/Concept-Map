import mongoose, { Schema } from "mongoose";
import { BidStatus, IBid } from "../../types/model";

const BidSchema: Schema = new Schema(
  {
    script_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Script",
      required: true,
    },
    buyer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: Object.values(BidStatus),
      default: BidStatus.PENDING,
    },
  },
  {
    timestamps: true,
  },
);

BidSchema.index({ script_id: 1, buyer_id: 1, status: 1 });

const BidModel = mongoose.model<IBid>("Bid", BidSchema);

export default BidModel;
