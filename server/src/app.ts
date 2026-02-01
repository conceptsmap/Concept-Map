import dotenv from "dotenv";
dotenv.config();
import express from "express";
import UserModel from "./repository/model/user.model";
import argon2 from "argon2";
import cors from "cors";
import morgan from "morgan";
import { PORT } from "./config";
import { router } from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { connectToDatabase } from "./connectDB";
import cookieParser from "cookie-parser";

// Ensure fixed login user exists in DB
async function ensureFixedUser() {
  const email = process.env.LOGIN_EMAIL;
  const password = process.env.LOGIN_PASSWORD;
  if (!email || !password) return;
  const user = await UserModel.findOne({ email });
  if (!user) {
    const hash = await argon2.hash(password);
    await UserModel.create({
      email,
      password: hash,
      is_verified: true,
      username: "Admin",
      profile_url: "",
      role: "ADMIN",
    });
    console.log("Fixed login user created");
  } else {
    // Optionally update password if needed
  }
}

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

connectToDatabase().then(ensureFixedUser);

//routes
app.use("/api", router);

//global error hanlder
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Successfully running on port ${PORT}`);
});
