import { NextFunction, Request, Response } from "express";
import { ScriptService } from "../services/script.service";

export class ScriptController {
  private readonly scriptService: ScriptService;

  constructor() {
    this.scriptService = new ScriptService();
  }

  createScipt = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized User",
        });
      }

      const result = await this.scriptService.createScript({
        ...req.body,
        userId,
      });

      res.status(201).json({
        status: "success",
        message: "Successfully uploaded story board",
        data: result,
      });
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
