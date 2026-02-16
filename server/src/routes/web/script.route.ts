import { Router } from "express";
import { ScriptController } from "../../controllers/script.controller";
import multer from "multer";
import jwtVerifyMiddleware from "../../middleware/jwtVerify";

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
    this.router.post("/script", jwtVerifyMiddleware, this.scriptController.createScript);
    this.router.post("/storyboard", jwtVerifyMiddleware, this.scriptController.createStoryBoard);
    this.router.post("/synopsis", jwtVerifyMiddleware, this.scriptController.createSynopsis);
    this.router.get("/all", this.scriptController.getAllScripts);
    this.router.get("/:id", this.scriptController.getScript);
    this.router.post(
      "/upload",
      this.upload.array("files", 10),
      this.scriptController.uploadStoryBoard
    );
    this.router.get("/all/details", this.scriptController.getAllOtherScripts);
  }
}

const scriptRouter = new ScriptRouter();
export default scriptRouter.router;
