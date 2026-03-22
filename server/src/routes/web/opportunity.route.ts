import { Router } from "express";
import { OpportunityController } from "../../controllers/opportunity.controller";
import jwtVerifyMiddleware, {
  optionalJwtVerifyMiddleware,
} from "../../middleware/jwtVerify";

export class OpportunityRouter {
  public router: Router;
  private opportunityController: OpportunityController;

  constructor() {
    this.router = Router();
    this.opportunityController = new OpportunityController();
    this.initRoutes();
  }

  private initRoutes() {
    // Buyer: create an opportunity
    this.router.post(
      "/",
      jwtVerifyMiddleware,
      this.opportunityController.createOpportunity,
    );

    // Buyer: see their own opportunities
    this.router.get(
      "/my",
      jwtVerifyMiddleware,
      this.opportunityController.getMyOpportunities,
    );

    // Public: list all open opportunities
    this.router.get(
      "/",
      optionalJwtVerifyMiddleware,
      this.opportunityController.listOpportunities,
    );

    // Public: single opportunity detail
    this.router.get(
      "/:id",
      optionalJwtVerifyMiddleware,
      this.opportunityController.getOpportunity,
    );

    // Seller: pitch to an opportunity
    this.router.post(
      "/:id/pitch",
      jwtVerifyMiddleware,
      this.opportunityController.createPitch,
    );

    // Buyer: get all pitches for their opportunity
    this.router.get(
      "/:id/pitches",
      jwtVerifyMiddleware,
      this.opportunityController.getPitches,
    );

    // Buyer: close an opportunity
    this.router.patch(
      "/:id/close",
      jwtVerifyMiddleware,
      this.opportunityController.closeOpportunity,
    );

    // Seller: check if they have already pitched
    this.router.get(
      "/:id/pitched",
      optionalJwtVerifyMiddleware,
      this.opportunityController.checkPitchStatus,
    );
  }
}

const opportunityRouter = new OpportunityRouter().router;
export default opportunityRouter;
