import { Router } from "express";
import { UserController } from "../../controllers/user.controller";

export class UserRouter {
  public router: Router;
  private userController: UserController;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get("/:userId", this.userController.getUserData);
    this.router.get("/", this.userController.getUserDataUsingEmail);
  }
}

const userRouter = new UserRouter();
export default userRouter.router;
