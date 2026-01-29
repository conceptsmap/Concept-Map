import { Router } from "express";
import { AuthController } from "../../controllers/auth.controller";

export class AuthRouter {
  public router: Router;
  private authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post("/register", this.authController.register);
    this.router.post("/login", this.authController.login);
    this.router.post("/otp/generate", this.authController.generateOTP);
    this.router.post("/otp/verify", this.authController.verifyEmail);
    this.router.post("/otp/resend", this.authController.resendOTP);
  }
}

const authRouter = new AuthRouter();
export default authRouter.router;
