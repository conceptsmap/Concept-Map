import { Router } from "express";
import { UserController } from "../../controllers/user.controller";
import jwtVerifyMiddleware from "../../middleware/jwtVerify";

export class UserRouter {
  public router: Router;
  private userController: UserController;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get("/me", jwtVerifyMiddleware, this.userController.getCurrentUser);
    this.router.get("/:userId", this.userController.getUserData);
    this.router.get("/", this.userController.getUserDataUsingEmail);
  }
}

const userRouter = new UserRouter();
export default userRouter.router;
