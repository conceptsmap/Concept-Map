import UserModel from "../repository/model/user.model";
import { CrudRepository } from "../repository/query/crud.repository";
import { IRegister } from "../types/auth";
import { IOtp, IUser } from "../types/model";
import argon2 from "argon2";
import { CustomError } from "../utils/customError";
import { generateOTP, hasOtpExpired } from "../utils/helper";
import OtpModel from "../repository/model/otp.model";

import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config";
import { sendEmail } from "../packages/notification/src";


export class AuthService {
  private readonly userCrudRepository: CrudRepository<IUser>;
  private readonly otpCrudRepository: CrudRepository<IOtp>;

  constructor() {
    this.userCrudRepository = new CrudRepository(UserModel);
    this.otpCrudRepository = new CrudRepository(OtpModel);
  }

  async register(data: IRegister) {
    const user = (await this.userCrudRepository.fetchOneDocument({
      email: data.email,
      role: data.role,
    })) as IUser;

    if (user && user.is_verified) {
      throw new CustomError(400, "INVALID_INPUT", {
        message: "User aready exist",
      });
    } else if (user) {
      return user;
    }

    const hashPassword = await argon2.hash(data.password);
    return await this.userCrudRepository.createDocument({
      ...data,
      password: hashPassword,
    });
  }

  async login(email: string, password: string, role?: string) {
    const user = (await this.userCrudRepository.fetchOneDocument({
      email: email,
    })) as IUser;

    if (!user || (user && !user.is_verified)) {
      throw new CustomError(400, "INVALID_INPUT", {
        message: "No such user exist",
      });
    }

    try {
      const passwordMatch = await argon2.verify(user.password, password);
      if (passwordMatch) {
        const jwtPayload = {
          id: user?._id,
          role: user.role,
          email: user.email,
        };
        //jwt creation
        const token = jwt.sign(jwtPayload, JWT_SECRET_KEY!, {
          expiresIn: "30d",
        });
        return {
          ...user,
          token,
        };
      }
    } catch (err) {
      console.error("Password verification error", err);
    }

    console.error("Wrong password");
    throw new CustomError(400, "BAD_REQUEST", { message: "Wrong password" });
  }

  // otp related methods
  async generateVerificationOTP(userId: string) {
    const otp = (await this.otpCrudRepository.fetchOneDocument(
      {
        userId: userId,
        action_type: "VERIFY_EMAIL",
      },
      "userId",
    ));

    // Generate a new OTP code
    const newCode = generateOTP();

    if (otp) {
      if (otp.retry_count === 0 && !hasOtpExpired(otp.updatedAt)) {
        throw new CustomError(400, "BAD_REQUEST", {
          message:
            "You can only request OTP up to 3 times within an hour. Please try again later.",
        });
      }

      const count = otp.retry_count > 0 ? otp.retry_count - 1 : 3;

      const username = otp.userId?.username;
      const formattedUsername = username
        ? username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()
        : null;

      sendEmail({
        to: otp.userId?.email,
        template: "emailVerificationOtp",
        template_variables: {
          firstName: formattedUsername,
          OTP: newCode,
        },
      });

      return await this.otpCrudRepository.updateDocumenById(otp._id.toString(), {
        code: newCode,
        retry_count: count,
      });
    } else {
      const user = (await this.userCrudRepository.fetchDocumentById(
        userId,
      )) as IUser;
      if (!user)
        throw new CustomError(400, "BAD_REQUEST", {
          message: "No such user",
        });
      const otpData = {
        userId: userId,
        code: newCode,
      };

      const username = user?.username;
      const formattedUsername = username
        ? username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()
        : null;

      sendEmail({
        to: user.email,
        template: "emailVerificationOtp",
        template_variables: {
          firstName: formattedUsername,
          OTP: newCode,
        },
      });

      return this.otpCrudRepository.createDocument(otpData);
    }
  }

  async verifyEmail(code: number, userId: string) {
    const otp = (await this.otpCrudRepository.fetchOneDocument({
      userId: userId,
      action_type: "VERIFY_EMAIL",
    })) as IOtp & { updatedAt: string };

    const otpUpdatedAt = new Date(otp.updatedAt);
    const now = new Date();
    const timeDifference = now.getTime() - otpUpdatedAt.getTime();
    const oneMinute = 60 * 1000;

    if (timeDifference > oneMinute) {
      throw new CustomError(400, "BAD_REQUEST", {
        message: "Otp has expired",
      });
    }
    if (otp.code === Number(code)) {
      await this.otpCrudRepository.deleteDocumenById(otp._id.toString());

      const user = (await this.userCrudRepository.updateDocumenById(userId, {
        is_verified: true,
      })) as IUser;

      const jwtPayload = {
        id: user?._id,
        role: user.role,
        email: user.email,
      };

      //jwt creation
      const token = jwt.sign(jwtPayload, JWT_SECRET_KEY!, {
        expiresIn: "30d",
      });

      return {
        ...user,
        token,
      };
    }

    throw new CustomError(400, "BAD_REQUEST", {
      message: "Incorrect OTP entered",
    });
  }

  async resendOtp(userId: string) {
    const otp = (await this.otpCrudRepository.fetchOneDocument(
      {
        userId: userId,
        action_type: "VERIFY_EMAIL",
      },
      "userId",
    ));

    if (otp.retry_count === 0 && !hasOtpExpired(otp.updatedAt)) {
      throw new CustomError(400, "BAD_REQUEST", {
        message:
          "You can only request OTP up to 3 times within an hour. Please try again later.",
      });
    }

    // Generate a new OTP code
    const newCode = generateOTP();

    const count = otp.retry_count > 0 ? otp.retry_count - 1 : 3;

    const username = otp.userId?.username;
    const formattedUsername = username
      ? username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()
      : null;

    sendEmail({
      to: otp.userId?.email,
      template: "emailVerificationOtp",
      template_variables: {
        firstName: formattedUsername,
        OTP: newCode,
      },
    });

    return await this.otpCrudRepository.updateDocumenById(otp._id.toString(), {
      code: newCode,
      retry_count: count,
    });
  }
}
