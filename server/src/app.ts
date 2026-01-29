import express from "express";
import cors from "cors";
import morgan from "morgan";
import { PORT } from "./config";
import { router } from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { connectToDatabase } from "./connectDB";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));

//cors
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    origin: [
      /http(|s):\/\/(|www\.)localhost:(3000|3001|3002|3003)$/,
      /http(|s):\/\/(|www\.)127.0.0.1:(3000|3001|3002|3003)$/,
      "https://concept-map-seven.vercel.app",
    ],
    credentials: true,
  }),
);

app.use(cookieParser());

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

//function to connect to the database
connectToDatabase();

//routes
app.use("/api", router);

//global error hanlder
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Successfully running on port ${PORT}`);
});
