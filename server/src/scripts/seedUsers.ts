import mongoose from "mongoose";
import UserModel from "../repository/model/user.model";
import argon2 from "argon2";
import { Role } from "../types/model";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

const seedUsers = async () => {
  try {
    if (!MONGO_URL) {
      throw new Error("MONGO_URL is not defined in .env");
    }

    // Connect to MongoDB
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");

    // Buyer User
    const buyerEmail = process.env.BUYER_EMAIL || "buyer@example.com";
    const buyerPassword = process.env.BUYER_PASSWORD || "buyer123";
    const buyerUsername = process.env.BUYER_USERNAME || "Buyer User";

    // Seller User (using CREATOR role as seller)
    const sellerEmail = process.env.SELLER_EMAIL || "seller@example.com";
    const sellerPassword = process.env.SELLER_PASSWORD || "seller123";
    const sellerUsername = process.env.SELLER_USERNAME || "Seller User";

    // Check if buyer already exists
    const existingBuyer = await UserModel.findOne({
      email: buyerEmail,
      role: Role.BUYER,
    });

    if (existingBuyer) {
      console.log("Buyer user already exists");
    } else {
      const hashedBuyerPassword = await argon2.hash(buyerPassword);
      await UserModel.create({
        email: buyerEmail,
        password: hashedBuyerPassword,
        username: buyerUsername,
        role: Role.BUYER,
        is_verified: true,
      });
      console.log("✓ Buyer user created successfully");
    }

    // Check if seller already exists
    const existingSeller = await UserModel.findOne({
      email: sellerEmail,
      role: Role.CREATOR,
    });

    if (existingSeller) {
      console.log("Seller user already exists");
    } else {
      const hashedSellerPassword = await argon2.hash(sellerPassword);
      await UserModel.create({
        email: sellerEmail,
        password: hashedSellerPassword,
        username: sellerUsername,
        role: Role.CREATOR,
        is_verified: true,
      });
      console.log("✓ Seller user created successfully");
    }

    console.log("\n=== Seeding Complete ===");
    console.log("Buyer credentials:");
    console.log(`  Email: ${buyerEmail}`);
    console.log(`  Password: ${buyerPassword}`);
    console.log(`  Role: BUYER`);
    console.log("\nSeller credentials:");
    console.log(`  Email: ${sellerEmail}`);
    console.log(`  Password: ${sellerPassword}`);
    console.log(`  Role: CREATOR`);

    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
};

seedUsers();
