import mongoose, { mongo } from "mongoose";

export const connectToDatabase = async () => {
  try {
    const MONGO_URL = process.env.MONGO_URL;

    if (!MONGO_URL) throw new Error("MONGO URL must be defined");

    await mongoose.connect(MONGO_URL);

    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
