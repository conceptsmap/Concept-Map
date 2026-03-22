import mongoose from "mongoose";
import OpportunityModel from "../repository/model/opportunity.model";
import OpportunityPitchModel, {
  MAX_PITCHES_PER_OPPORTUNITY,
} from "../repository/model/opportunitypitch.model";
import { OpportunityStatus, ScriptType } from "../types/model";

export class OpportunityService {
  // Buyer creates a new opportunity
  async createOpportunity(
    buyerId: string,
    data: {
      title: string;
      description: string;
      budget: number;
      required_type?: ScriptType | null;
    },
  ) {
    const opportunity = await OpportunityModel.create({
      buyer_id: new mongoose.Types.ObjectId(buyerId),
      title: data.title,
      description: data.description,
      budget: data.budget,
      required_type: data.required_type || null,
      status: OpportunityStatus.OPEN,
    });

    return opportunity;
  }

  // List all open opportunities with pitch counts (public / optional auth)
  async listOpportunities(skip = 0, limit = 20) {
    const opportunities = await OpportunityModel.find({
      status: OpportunityStatus.OPEN,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("buyer_id", "username email profile_url")
      .lean();

    // Attach pitch count to each opportunity
    const ids = opportunities.map((o) => o._id);
    const pitchCounts = await OpportunityPitchModel.aggregate([
      { $match: { opportunity_id: { $in: ids } } },
      { $group: { _id: "$opportunity_id", count: { $sum: 1 } } },
    ]);
    const countMap: Record<string, number> = {};
    pitchCounts.forEach((p) => {
      countMap[String(p._id)] = p.count;
    });

    return opportunities.map((o) => ({
      ...o,
      pitch_count: countMap[String(o._id)] || 0,
    }));
  }

  // Buyer sees their own created opportunities with pitch counts
  async getMyOpportunities(buyerId: string) {
    const opportunities = await OpportunityModel.find({
      buyer_id: new mongoose.Types.ObjectId(buyerId),
    })
      .sort({ createdAt: -1 })
      .lean();

    const ids = opportunities.map((o) => o._id);
    const pitchCounts = await OpportunityPitchModel.aggregate([
      { $match: { opportunity_id: { $in: ids } } },
      { $group: { _id: "$opportunity_id", count: { $sum: 1 } } },
    ]);
    const countMap: Record<string, number> = {};
    pitchCounts.forEach((p) => {
      countMap[String(p._id)] = p.count;
    });

    return opportunities.map((o) => ({
      ...o,
      pitch_count: countMap[String(o._id)] || 0,
    }));
  }

  // Get a single opportunity with its buyer info and pitch count
  async getOpportunityById(id: string) {
    const opportunity = await OpportunityModel.findById(id)
      .populate("buyer_id", "username email profile_url")
      .lean();

    if (!opportunity) {
      throw new Error("Opportunity not found");
    }

    const pitchCount = await OpportunityPitchModel.countDocuments({
      opportunity_id: new mongoose.Types.ObjectId(id),
    });

    return { ...opportunity, pitch_count: pitchCount };
  }

  // Seller pitches to an opportunity
  async createPitch(
    sellerId: string,
    opportunityId: string,
    data: {
      pitch_type: ScriptType;
      script_id?: string | null;
      message?: string;
    },
  ) {
    const opportunity = await OpportunityModel.findById(opportunityId);
    if (!opportunity) {
      throw new Error("Opportunity not found");
    }
    if (opportunity.status !== OpportunityStatus.OPEN) {
      throw new Error("This opportunity is no longer accepting pitches");
    }

    // Check max pitches cap
    const pitchCount = await OpportunityPitchModel.countDocuments({
      opportunity_id: new mongoose.Types.ObjectId(opportunityId),
    });
    if (pitchCount >= MAX_PITCHES_PER_OPPORTUNITY) {
      throw new Error(
        `This opportunity has reached the maximum of ${MAX_PITCHES_PER_OPPORTUNITY} pitches`,
      );
    }

    // Prevent buyer from pitching on their own opportunity
    if (String(opportunity.buyer_id) === sellerId) {
      throw new Error("You cannot pitch on your own opportunity");
    }

    const pitch = await OpportunityPitchModel.create({
      opportunity_id: new mongoose.Types.ObjectId(opportunityId),
      seller_id: new mongoose.Types.ObjectId(sellerId),
      script_id: data.script_id
        ? new mongoose.Types.ObjectId(data.script_id)
        : null,
      pitch_type: data.pitch_type,
      message: data.message || "",
    });

    return pitch;
  }

  // Buyer gets all pitches for their opportunity
  async getPitchesForOpportunity(opportunityId: string, buyerId: string) {
    const opportunity = await OpportunityModel.findById(opportunityId);
    if (!opportunity) {
      throw new Error("Opportunity not found");
    }
    if (String(opportunity.buyer_id) !== buyerId) {
      throw new Error("You are not the owner of this opportunity");
    }

    const pitches = await OpportunityPitchModel.find({
      opportunity_id: new mongoose.Types.ObjectId(opportunityId),
    })
      .populate("seller_id", "username email profile_url jobRole")
      .populate("script_id", "main_title type description")
      .sort({ createdAt: -1 })
      .lean();

    return pitches;
  }

  // Buyer closes an opportunity
  async closeOpportunity(opportunityId: string, buyerId: string) {
    const opportunity = await OpportunityModel.findById(opportunityId);
    if (!opportunity) {
      throw new Error("Opportunity not found");
    }
    if (String(opportunity.buyer_id) !== buyerId) {
      throw new Error("You are not the owner of this opportunity");
    }

    opportunity.status = OpportunityStatus.CLOSED;
    await opportunity.save();

    return opportunity;
  }

  // Check if seller has already pitched
  async hasSellerPitched(
    sellerId: string,
    opportunityId: string,
  ): Promise<boolean> {
    const existing = await OpportunityPitchModel.findOne({
      opportunity_id: new mongoose.Types.ObjectId(opportunityId),
      seller_id: new mongoose.Types.ObjectId(sellerId),
    });
    return !!existing;
  }
}
