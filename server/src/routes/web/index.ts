import { Router } from "express";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import scriptRouter from "./script.route";
import searchRouter from "./search.route";
import opportunityRouter from "./opportunity.route";
import reviewRouter from "./review.route";

export const webRouter = Router();

webRouter.use("/auth", authRouter);
webRouter.use("/user", userRouter);
webRouter.use("/script", scriptRouter);
webRouter.use("/search", searchRouter);
webRouter.use("/opportunity", opportunityRouter);
webRouter.use("/review", reviewRouter);
