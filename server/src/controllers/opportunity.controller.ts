import { NextFunction, Request, Response } from "express";
import { OpportunityService } from "../services/opportunity.service";
import { ScriptType } from "../types/model";

export class OpportunityController {
  private readonly opportunityService: OpportunityService;

  constructor() {
    this.opportunityService = new OpportunityService();
  }

  // POST /opportunity — buyer creates an opportunity
  createOpportunity = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const buyerId = req.user?.id;
      if (!buyerId) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized" });
      }

      const { title, description, budget, required_type } = req.body;

      if (!title || typeof title !== "string" || title.trim().length === 0) {
        return res
          .status(400)
          .json({ status: "error", message: "Title is required" });
      }
      if (
        !description ||
        typeof description !== "string" ||
        description.trim().length === 0
      ) {
        return res
          .status(400)
          .json({ status: "error", message: "Description is required" });
      }
      if (!budget || isNaN(Number(budget)) || Number(budget) <= 0) {
        return res
          .status(400)
          .json({ status: "error", message: "A valid budget is required" });
      }
      if (required_type && !Object.values(ScriptType).includes(required_type)) {
        return res
          .status(400)
          .json({ status: "error", message: "Invalid required_type value" });
      }

      const opportunity = await this.opportunityService.createOpportunity(
        buyerId,
        {
          title: title.trim(),
          description: description.trim(),
          budget: Number(budget),
          required_type: required_type || null,
        },
      );

      return res
        .status(201)
        .json({
          status: "success",
          message: "Opportunity created",
          data: opportunity,
        });
    } catch (error) {
      next(error);
    }
  };

  // GET /opportunity — list all open opportunities
  listOpportunities = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const skip = parseInt(String(req.query.skip || 0), 10);
      const limit = Math.min(parseInt(String(req.query.limit || 20), 10), 50);
      const opportunities = await this.opportunityService.listOpportunities(
        skip,
        limit,
      );
      return res.status(200).json({ status: "success", data: opportunities });
    } catch (error) {
      next(error);
    }
  };

  // GET /opportunity/my — buyer sees their own opportunities
  getMyOpportunities = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const buyerId = req.user?.id;
      if (!buyerId) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized" });
      }
      const opportunities =
        await this.opportunityService.getMyOpportunities(buyerId);
      return res.status(200).json({ status: "success", data: opportunities });
    } catch (error) {
      next(error);
    }
  };

  // GET /opportunity/:id — single opportunity detail
  getOpportunity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const opportunity = await this.opportunityService.getOpportunityById(id);
      return res.status(200).json({ status: "success", data: opportunity });
    } catch (error: any) {
      if (error.message === "Opportunity not found") {
        return res
          .status(404)
          .json({ status: "error", message: error.message });
      }
      next(error);
    }
  };

  // POST /opportunity/:id/pitch — seller submits a pitch
  createPitch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sellerId = req.user?.id;
      if (!sellerId) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized" });
      }

      const opportunityId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const { pitch_type, script_id, message } = req.body;

      if (!pitch_type || !Object.values(ScriptType).includes(pitch_type)) {
        return res.status(400).json({
          status: "error",
          message: `pitch_type must be one of: ${Object.values(ScriptType).join(", ")}`,
        });
      }

      const pitch = await this.opportunityService.createPitch(
        sellerId,
        opportunityId,
        {
          pitch_type,
          script_id: script_id || null,
          message: message || "",
        },
      );

      return res
        .status(201)
        .json({ status: "success", message: "Pitch submitted", data: pitch });
    } catch (error: any) {
      const status400Messages = [
        "Opportunity not found",
        "This opportunity is no longer accepting pitches",
        "This opportunity has reached the maximum of 25 pitches",
        "You cannot pitch on your own opportunity",
      ];
      if (
        status400Messages.includes(error.message) ||
        error.code === 11000 // duplicate key — already pitched
      ) {
        const message =
          error.code === 11000
            ? "You have already pitched for this opportunity"
            : error.message;
        return res.status(400).json({ status: "error", message });
      }
      next(error);
    }
  };

  // GET /opportunity/:id/pitches — buyer sees pitches for their opportunity
  getPitches = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const buyerId = req.user?.id;
      if (!buyerId) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized" });
      }

      const opportunityId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const pitches = await this.opportunityService.getPitchesForOpportunity(
        opportunityId,
        buyerId,
      );
      return res.status(200).json({ status: "success", data: pitches });
    } catch (error: any) {
      if (
        error.message === "Opportunity not found" ||
        error.message === "You are not the owner of this opportunity"
      ) {
        return res
          .status(403)
          .json({ status: "error", message: error.message });
      }
      next(error);
    }
  };

  // PATCH /opportunity/:id/close — buyer closes an opportunity
  closeOpportunity = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const buyerId = req.user?.id;
      if (!buyerId) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized" });
      }

      const opportunityId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const opportunity = await this.opportunityService.closeOpportunity(
        opportunityId,
        buyerId,
      );
      return res
        .status(200)
        .json({
          status: "success",
          message: "Opportunity closed",
          data: opportunity,
        });
    } catch (error: any) {
      if (
        error.message === "Opportunity not found" ||
        error.message === "You are not the owner of this opportunity"
      ) {
        return res
          .status(403)
          .json({ status: "error", message: error.message });
      }
      next(error);
    }
  };

  // GET /opportunity/:id/pitched — check if caller has pitched (for sellers)
  checkPitchStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const sellerId = req.user?.id;
      if (!sellerId) {
        return res
          .status(200)
          .json({ status: "success", data: { has_pitched: false } });
      }
      const opportunityId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const hasPitched = await this.opportunityService.hasSellerPitched(
        sellerId,
        opportunityId,
      );
      return res
        .status(200)
        .json({ status: "success", data: { has_pitched: hasPitched } });
    } catch (error) {
      next(error);
    }
  };
}
