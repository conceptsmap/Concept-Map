import { Router } from "express";
import { webRouter } from "./web";

export const router = Router();

//for all the routes related to creator and buyer
router.use("/web", webRouter);

//for all the routes related to admin
// router.use("/admin", adminRouter);
