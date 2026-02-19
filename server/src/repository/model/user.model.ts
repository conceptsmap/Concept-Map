import mongoose, { Schema } from "mongoose";
import { IUser, Role } from "../../types/model";

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    profile_url: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: Object.values(Role),
      required: true,
    },
    jobRole: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
