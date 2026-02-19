import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }
      const result = await this.userService.getUserData(userId);
      res.status(200).json({
        status: "success",
        message: "User data fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getUserData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const result = await this.userService.getUserData(userId as string);
      res.status(201).json({
        status: "success",
        message: "User data fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getUserDataUsingEmail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email, role } = req.query;
      const result = await this.userService.getUserDataUsingEmail(
        email as string,
        role as string,
      );
      res.status(201).json({
        status: "success",
        message: "User data fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
