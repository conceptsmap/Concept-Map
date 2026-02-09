import { NextFunction, Request, Response } from "express";
import { ScriptService } from "../services/script.service";
import { ScriptType } from "../types/model";
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
        return res.status(401).json({ status: "error", message: "Unauthorized User" });
      }
      const { main_title, description, category, genre, industry_category, script } = req.body;
      const result = await this.scriptService.createScript({
        main_title,
        description,
        category,
        genre,
        industry_category,
        type: [ScriptType.SCRIPT],
        userId: new mongoose.Types.ObjectId(userId),
        script,
      });
      res.status(201).json({ status: "success", message: "Script created", data: result });
    } catch (error) {
      next(error);
    }
  };

  // Create Story Board Post
  createStoryBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ status: "error", message: "Unauthorized User" });
      }
      const { main_title, description, category, genre, industry_category, story_borad } = req.body;
      const result = await this.scriptService.createScript({
        main_title,
        description,
        category,
        genre,
        industry_category,
        type: [ScriptType.STORY_BOARD],
        userId: new mongoose.Types.ObjectId(userId),
        story_borad,
      });
      res.status(201).json({ status: "success", message: "Story Board created", data: result });
    } catch (error) {
      next(error);
    }
  };

  // Create Synopsis Post
  createSynopsis = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ status: "error", message: "Unauthorized User" });
      }
      const { main_title, description, category, genre, industry_category, synopsis } = req.body;
      const result = await this.scriptService.createScript({
        main_title,
        description,
        category,
        genre,
        industry_category,
        type: [ScriptType.SYNOPSIS],
        userId: new mongoose.Types.ObjectId(userId),
        synopsis,
      });
      res.status(201).json({ status: "success", message: "Synopsis created", data: result });
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
    next: NextFunction
  ) => {
    try {
      console.log("hiii")
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
    next: NextFunction
  ) => {
    try {
      const { scriptId, userId } = req.query;
      const normalizedUserId = Array.isArray(userId) ? userId[0] : userId;
      const normalizedScriptId = Array.isArray(scriptId)
        ? scriptId[0]
        : scriptId;

      if (
        typeof normalizedUserId !== "string" ||
        typeof normalizedScriptId !== "string"
      ) {
        return res.status(400).json({
          status: "error",
          message: "scriptId and userId are required",
        });
      }

      const result = await this.scriptService.getAllOtherScripts(
        normalizedUserId,
        normalizedScriptId
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
}
