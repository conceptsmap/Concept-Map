import { Router } from "express";
import { ScriptController } from "../../controllers/script.controller";
import multer from "multer";
import jwtVerifyMiddleware, {
  optionalJwtVerifyMiddleware,
} from "../../middleware/jwtVerify";

export class ScriptRouter {
  public router: Router;
  private scriptController: ScriptController;
  private upload: any;

  constructor() {
    this.router = Router();
    this.scriptController = new ScriptController();
    this.upload = multer({ dest: "uploads/" });
    this.initRoutes();
  }

  private initRoutes() {
    // Separate endpoints for each type
    this.router.post(
      "/script",
      jwtVerifyMiddleware,
      this.scriptController.createScript,
    );
    this.router.post(
      "/storyboard",
      jwtVerifyMiddleware,
      this.scriptController.createStoryBoard,
    );
    this.router.post(
      "/synopsis",
      jwtVerifyMiddleware,
      this.scriptController.createSynopsis,
    );
    this.router.get(
      "/bids/received",
      jwtVerifyMiddleware,
      this.scriptController.getReceivedBids,
    );
    this.router.get(
      "/bids/placed",
      jwtVerifyMiddleware,
      this.scriptController.getPlacedBids,
    );
    this.router.patch(
      "/bids/:bidId/accept",
      jwtVerifyMiddleware,
      this.scriptController.acceptBid,
    );
    this.router.delete(
      "/bids/:bidId",
      jwtVerifyMiddleware,
      this.scriptController.deleteBid,
    );
    this.router.post(
      "/payments",
      jwtVerifyMiddleware,
      this.scriptController.createPayment,
    );
    this.router.get(
      "/payments/buyer",
      jwtVerifyMiddleware,
      this.scriptController.getBuyerPayments,
    );
    this.router.get(
      "/payments/seller",
      jwtVerifyMiddleware,
      this.scriptController.getSellerPayments,
    );
    this.router.get("/bids/:bidId", this.scriptController.getBid);
    this.router.post(
      "/:id/bid",
      jwtVerifyMiddleware,
      this.scriptController.createBid,
    );
    this.router.get(
      "/all",
      optionalJwtVerifyMiddleware,
      this.scriptController.getAllScripts,
    );
    this.router.get("/:id", this.scriptController.getScript);
    this.router.post(
      "/upload",
      this.upload.array("files", 10),
      this.scriptController.uploadStoryBoard,
    );
    this.router.get(
      "/all/details",
      jwtVerifyMiddleware,
      this.scriptController.getAllOtherScripts,
    );
    // Edit and Delete endpoints
    this.router.put(
      "/:id",
      jwtVerifyMiddleware,
      this.scriptController.updateScript,
    );
    this.router.delete(
      "/:id",
      jwtVerifyMiddleware,
      this.scriptController.deleteScript,
    );
  }
}

const scriptRouter = new ScriptRouter();
export default scriptRouter.router;
