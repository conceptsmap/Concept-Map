import { Router } from "express";
import { SearchController } from "../../controllers/search.controller";
import { optionalJwtVerifyMiddleware } from "../../middleware/jwtVerify";

export class SearchRouter {
  public router: Router;
  private searchController: SearchController;

  constructor() {
    this.router = Router();
    this.searchController = new SearchController();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(
      "/",
      optionalJwtVerifyMiddleware,
      this.searchController.filterScript,
    );
  }
}

const searchRouter = new SearchRouter();
export default searchRouter.router;
