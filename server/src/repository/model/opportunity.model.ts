import mongoose, { Schema } from "mongoose";
import { IOpportunity, OpportunityStatus, ScriptType } from "../../types/model";

const OpportunitySchema: Schema = new Schema(
  {
    buyer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    budget: {
      type: Number,
      required: true,
      min: 1,
    },
    required_type: {
      type: String,
      enum: Object.values(ScriptType),
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(OpportunityStatus),
      default: OpportunityStatus.OPEN,
    },
  },
  {
    timestamps: true,
  },
);

OpportunitySchema.index({ status: 1, createdAt: -1 });
OpportunitySchema.index({ buyer_id: 1 });

const OpportunityModel = mongoose.model<IOpportunity>(
  "Opportunity",
  OpportunitySchema,
);

export default OpportunityModel;
