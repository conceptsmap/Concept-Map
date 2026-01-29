import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config";

interface IUser {
  id: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const jwtVerifyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tokenHeader = req.headers.authorization;

  if (!tokenHeader) {
    return res.status(401).json({ error: { message: "Unauthorized User" } });
  }

  const token = tokenHeader.split(" ")[1];

  try {
    const user = jwt.verify(token, JWT_SECRET_KEY!) as IUser;

    req.user = user;

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: {
          message: "Token has expired",
        },
      });
    }

    // Handle any other errors
    return res.status(500).json({
      error: {
        message: "Failed to authenticate token",
      },
    });
  }
};

export default jwtVerifyMiddleware;
