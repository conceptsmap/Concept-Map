import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getUserData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const result = await this.userService.getUserData(userId);
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
    next: NextFunction
  ) => {
    try {
      const { email, role } = req.query;
      const result = await this.userService.getUserDataUsingEmail(
        email as string,
        role as string
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
