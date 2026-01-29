import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.register(req.body);
      res.status(201).json({
        status: "success",
        message: "Registration completed successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, role } = req.body;
      const result = await this.authService.login(email, password, role);
      res.status(200).json({
        status: "success",
        message: "User successfully logged in",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  generateOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.body;
      const result = await this.authService.generateVerificationOTP(userId);
      res.status(200).json({
        status: "success",
        message: "OTP is generated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, userId } = req.body;
      const result = await this.authService.verifyEmail(code, userId);
      res.status(200).json({
        status: "success",
        message: "Successfully verified the email",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  resendOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.body;
      const result = await this.authService.resendOtp(userId);
      res.status(200).json({
        status: "success",
        message: "OTP is again send again successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
