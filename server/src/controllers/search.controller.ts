import { NextFunction, Request, Response } from "express";
import { SearchService } from "../services/search.service";

export class SearchController {
  private readonly searchService: SearchService;

  constructor() {
    this.searchService = new SearchService();
  }

  filterScript = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = req.query;
      const result = await this.searchService.searchScript(filters);
      res.status(201).json({
        status: "success",
        message: "Successfully fetch scripts",
        data: result,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
