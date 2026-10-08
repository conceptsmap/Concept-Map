import { Router } from "express";
import mongoose from "mongoose";
import { webRouter } from "./web";

export const router = Router();

//health check for uptime monitors and load balancers
router.get("/health", (_req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? "ok" : "degraded",
    db: dbConnected ? "connected" : "disconnected",
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

//for all the routes related to creator and buyer
router.use("/web", webRouter);

//for all the routes related to admin
// router.use("/admin", adminRouter);
