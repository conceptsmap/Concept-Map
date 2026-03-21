import { NextFunction, Request, Response } from "express";
import { ScriptService } from "../services/script.service";
import { PaymentMethod, SaleType, ScriptType } from "../types/model";
import mongoose from "mongoose";

export class ScriptController {
  private readonly scriptService: ScriptService;

  constructor() {
    this.scriptService = new ScriptService();
  }

  // Create Script Post
  createScript = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized User" });
      }
      const {
        main_title,
        description,
        category,
        genre,
        industry_category,
        script,
        sale_type,
        minimum_bid,
        country,
        state,
        is_draft,
      } = req.body;

      const normalizedSaleType =
        (sale_type || script?.sale_type) === SaleType.BIDDABLE
          ? SaleType.BIDDABLE
          : SaleType.FIXED;

      const result = await this.scriptService.createScript({
        main_title,
        description,
        category,
        genre,
        industry_category,
        type: [ScriptType.SCRIPT],
        userId: new mongoose.Types.ObjectId(userId),
        script: {
          ...(script || {}),
          sale_type: normalizedSaleType,
          minimum_bid:
            normalizedSaleType === SaleType.BIDDABLE
              ? Number(minimum_bid || script?.minimum_bid || 0)
              : undefined,
        },
        country,
        state,
        is_draft: is_draft || false,
      });
      res
        .status(201)
        .json({ status: "success", message: "Script created", data: result });
    } catch (error) {
      next(error);
    }
  };

  // Create Story Board Post
  createStoryBoard = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized User" });
      }
      const {
        main_title,
        description,
        category,
        genre,
        industry_category,
        story_borad,
        sale_type,
        minimum_bid,
        country,
        state,
        is_draft,
      } = req.body;

      const normalizedSaleType =
        (sale_type || story_borad?.sale_type) === SaleType.BIDDABLE
          ? SaleType.BIDDABLE
          : SaleType.FIXED;

      const result = await this.scriptService.createScript({
        main_title,
        description,
        category,
        genre,
        industry_category,
        type: [ScriptType.STORY_BOARD],
        userId: new mongoose.Types.ObjectId(userId),
        story_borad: {
          ...(story_borad || {}),
          sale_type: normalizedSaleType,
          minimum_bid:
            normalizedSaleType === SaleType.BIDDABLE
              ? Number(minimum_bid || story_borad?.minimum_bid || 0)
              : undefined,
        },
        country,
        state,
        is_draft: is_draft || false,
      });
      res.status(201).json({
        status: "success",
        message: "Story Board created",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  // Create Synopsis Post
  createSynopsis = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized User" });
      }
      const {
        main_title,
        description,
        category,
        genre,
        industry_category,
        synopsis,
        sale_type,
        minimum_bid,
        country,
        state,
        is_draft,
      } = req.body;

      const normalizedSaleType =
        (sale_type || synopsis?.sale_type) === SaleType.BIDDABLE
          ? SaleType.BIDDABLE
          : SaleType.FIXED;

      const result = await this.scriptService.createScript({
        main_title,
        description,
        category,
        genre,
        industry_category,
        type: [ScriptType.SYNOPSIS],
        userId: new mongoose.Types.ObjectId(userId),
        synopsis: {
          ...(synopsis || {}),
          sale_type: normalizedSaleType,
          minimum_bid:
            normalizedSaleType === SaleType.BIDDABLE
              ? Number(minimum_bid || synopsis?.minimum_bid || 0)
              : undefined,
        },
        country,
        state,
        is_draft: is_draft || false,
      });
      res
        .status(201)
        .json({ status: "success", message: "Synopsis created", data: result });
    } catch (error) {
      next(error);
    }
  };

  getScript = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scriptId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      if (typeof scriptId !== "string") {
        return res.status(400).json({
          status: "error",
          message: "script id is required",
        });
      }

      const result = await this.scriptService.getScriptDetails(scriptId);
      res.status(201).json({
        status: "success",
        message: "Successfully fetched script details",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  uploadStoryBoard = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.scriptService.uploadStoryBoard(req.files);
      res.status(201).json({
        status: "success",
        message: "Successfully fetched script details",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllOtherScripts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      let { scriptId, userId } = req.query;

      // If userId is not provided in query, use the authenticated user's ID
      if (!userId && req.user?.id) {
        userId = req.user.id;
      }

      const normalizedUserId = Array.isArray(userId) ? userId[0] : userId;
      const normalizedScriptId = Array.isArray(scriptId)
        ? scriptId[0]
        : scriptId || "";

      if (typeof normalizedUserId !== "string") {
        return res.status(400).json({
          status: "error",
          message: "userId is required",
        });
      }

      console.log(normalizedUserId);
      const result = await this.scriptService.getAllOtherScripts(
        normalizedUserId,
        normalizedScriptId as string,
      );
      res.status(201).json({
        status: "success",
        message: "Successfully fetched script details",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllScripts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const skip = parseInt(req.query.skip as string) || 0;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await this.scriptService.getAllScripts(
        skip,
        limit,
        req.user?.id,
      );
      res.status(200).json({
        status: "success",
        message: "Successfully fetched all scripts",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  updateScript = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized User" });
      }

      const scriptId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      if (typeof scriptId !== "string") {
        return res.status(400).json({
          status: "error",
          message: "script id is required",
        });
      }

      // Verify user owns the script
      const existingScript =
        await this.scriptService.getScriptDetails(scriptId);
      if (existingScript.userId._id.toString() !== userId) {
        return res.status(403).json({
          status: "error",
          message: "You can only edit your own scripts",
        });
      }

      const updateData = req.body;
      const result = await this.scriptService.updateScript(
        scriptId,
        updateData,
      );

      res.status(200).json({
        status: "success",
        message: "Script updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteScript = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized User" });
      }

      const scriptId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      if (typeof scriptId !== "string") {
        return res.status(400).json({
          status: "error",
          message: "script id is required",
        });
      }

      // Verify user owns the script
      const existingScript =
        await this.scriptService.getScriptDetails(scriptId);
      if (existingScript.userId._id.toString() !== userId) {
        return res.status(403).json({
          status: "error",
          message: "You can only delete your own scripts",
        });
      }

      const result = await this.scriptService.deleteScript(scriptId);

      res.status(200).json({
        status: "success",
        message: "Script deleted successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  createBid = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized User" });
      }

      const scriptId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      if (!scriptId) {
        return res
          .status(400)
          .json({ status: "error", message: "script id is required" });
      }

      const amount = Number(req.body?.amount);
      if (!Number.isFinite(amount) || amount <= 0) {
        return res
          .status(400)
          .json({ status: "error", message: "Valid bid amount is required" });
      }

      const result = await this.scriptService.createBid(
        scriptId,
        userId,
        amount,
      );

      res.status(201).json({
        status: "success",
        message: "Bid placed successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getReceivedBids = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized User" });
      }

      const result = await this.scriptService.getReceivedBids(userId);

      res.status(200).json({
        status: "success",
        message: "Successfully fetched received bids",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getPlacedBids = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized User" });
      }

      const result = await this.scriptService.getPlacedBids(userId);

      res.status(200).json({
        status: "success",
        message: "Successfully fetched placed bids",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  acceptBid = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized User" });
      }

      const bidId = Array.isArray(req.params.bidId)
        ? req.params.bidId[0]
        : req.params.bidId;

      if (!bidId) {
        return res
          .status(400)
          .json({ status: "error", message: "bid id is required" });
      }

      const result = await this.scriptService.acceptBid(bidId, userId);

      res.status(200).json({
        status: "success",
        message: "Bid accepted successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteBid = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized User" });
      }

      const bidId = Array.isArray(req.params.bidId)
        ? req.params.bidId[0]
        : req.params.bidId;

      if (!bidId) {
        return res
          .status(400)
          .json({ status: "error", message: "bid id is required" });
      }

      const result = await this.scriptService.deleteBid(bidId, userId);

      res.status(200).json({
        status: "success",
        message: "Bid deleted successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getBid = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bidId = Array.isArray(req.params.bidId)
        ? req.params.bidId[0]
        : req.params.bidId;

      if (!bidId) {
        return res
          .status(400)
          .json({ status: "error", message: "bid id is required" });
      }

      const result = await this.scriptService.getBid(bidId);

      res.status(200).json({
        status: "success",
        message: "Bid fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  createPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized User" });
      }

      const { bidId, postId, payment_method } = req.body || {};

      if (
        !payment_method ||
        !Object.values(PaymentMethod).includes(payment_method)
      ) {
        return res.status(400).json({
          status: "error",
          message: "Valid payment_method is required",
        });
      }

      const result = await this.scriptService.createPayment(
        userId,
        payment_method,
        {
          bidId,
          postId,
        },
      );

      res.status(201).json({
        status: "success",
        message: "Payment completed successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getBuyerPayments = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized User" });
      }

      const result = await this.scriptService.getBuyerPayments(userId);
      res.status(200).json({
        status: "success",
        message: "Successfully fetched payment history",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getSellerPayments = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized User" });
      }

      const result = await this.scriptService.getSellerPayments(userId);
      res.status(200).json({
        status: "success",
        message: "Successfully fetched seller payments",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
