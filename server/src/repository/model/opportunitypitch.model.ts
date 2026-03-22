import mongoose, { Schema } from "mongoose";
import { IOpportunityPitch, PitchStatus, ScriptType } from "../../types/model";

const MAX_PITCHES_PER_OPPORTUNITY = 25;

const OpportunityPitchSchema: Schema = new Schema(
  {
    opportunity_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
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
      default: null,
    },
    pitch_type: {
      type: String,
      enum: Object.values(ScriptType),
      required: true,
    },
    message: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: Object.values(PitchStatus),
      default: PitchStatus.PENDING,
    },
  },
  {
    timestamps: true,
  },
);

// One seller can only pitch once per opportunity
OpportunityPitchSchema.index(
  { opportunity_id: 1, seller_id: 1 },
  { unique: true },
);

export { MAX_PITCHES_PER_OPPORTUNITY };

const OpportunityPitchModel = mongoose.model<IOpportunityPitch>(
  "OpportunityPitch",
  OpportunityPitchSchema,
);

export default OpportunityPitchModel;
