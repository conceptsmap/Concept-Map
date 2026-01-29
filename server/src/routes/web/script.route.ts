import { Router } from "express";
import { ScriptController } from "../../controllers/script.controller";
import multer from "multer";

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
    this.router.post("/", this.scriptController.createScipt);
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
