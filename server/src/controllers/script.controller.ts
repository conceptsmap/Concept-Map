import { NextFunction, Request, Response } from "express";
import { ScriptService } from "../services/script.service";

export class ScriptController {
  private readonly scriptService: ScriptService;

  constructor() {
    this.scriptService = new ScriptService();
  }

  createScipt = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.scriptService.createScript(req.body);

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
      const result = await this.scriptService.getScriptDetails(req.params.id);
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
      const result = await this.scriptService.getAllOtherScripts(
        userId as string,
        scriptId as string
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
