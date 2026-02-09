import { Response, Request, NextFunction } from "express";
import { CustomError } from "../utils/customError";

// Global error handler middleware
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log all errors for debugging
  console.error(error);

  //custom errors
  if (error instanceof CustomError) {
    res.status(Number(error.status)).json({
      status: "error",
      message: error.message,
      error: error.error,
    });
  }

  //unknown error
  else {
    res.status(500).json({
      message: "Server Internal Error",
      error: error.message,
    });
  }
};
