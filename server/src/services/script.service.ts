import ScriptModel from "../repository/model/script.model";
import BidModel from "../repository/model/bid.model";
import PurchaseModel from "../repository/model/purschase.model";
import { CrudRepository } from "../repository/query/crud.repository";
import { IScript } from "../types/model";
import { IScriptCreate } from "../types/model";
import { BidStatus } from "../types/model";
import { PaymentMethod } from "../types/model";
import { v2 as cloudinary } from "cloudinary";
import { CustomError } from "../utils/customError";
import mongoose from "mongoose";

export class ScriptService {
  private readonly crudRepository: CrudRepository<IScript>;

  constructor() {
    this.crudRepository = new CrudRepository(ScriptModel);
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async createScript(data: IScriptCreate) {
    return await this.crudRepository.createDocument(data);
  }

  async getScriptDetails(id: string) {
    return await this.crudRepository.fetchDocumentById(id, "", "userId");
  }

  async uploadStoryBoard(files: any) {
    if (!files)
      throw new CustomError(400, "INVALID_INPUT", {
        message: "File does not exist",
      });

    const uploadPromises = files.map(async (file: any) => {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "scripts",
        use_filename: true,
        invalidate: true,
        resource_type: "auto",
      });
      return result.secure_url;
    });

    return await Promise.all(uploadPromises);
  }

  async getAllOtherScripts(userId: string, scriptId: string) {
    const scripts = await this.crudRepository.fetchAllDocuments(
      {
        userId: userId,
        // _id: { $ne: scriptId },
      },
      0,
      10,
      "userId",
      "desc",
    );

    return scripts;
  }

  async getAllScripts(skip: number = 0, limit: number = 20, userId?: string) {
    const reviewCutoff = new Date(Date.now() - 2 * 60 * 1000);
    const where: Record<string, any> = {
      is_draft: { $ne: true },
      createdAt: { $lte: reviewCutoff },
    };

    if (userId) {
      const purchases = await PurchaseModel.find({
        user_id: new mongoose.Types.ObjectId(userId),
      })
        .select("script_id")
        .lean();

      const purchasedScriptIds = purchases.map(
        (purchase) => purchase.script_id,
      );
      if (purchasedScriptIds.length > 0) {
        where._id = { $nin: purchasedScriptIds };
      }
    }

    const scripts = await this.crudRepository.fetchAllDocuments(
      where,
      skip,
      limit,
      "userId",
      "desc",
    );
    return scripts;
  }

  async updateScript(id: string, updateData: any) {
    return await this.crudRepository.updateDocumenById(id, updateData);
  }

  async deleteScript(id: string) {
    return await this.crudRepository.deleteDocumenById(id);
  }

  async createBid(scriptId: string, buyerId: string, amount: number) {
    const script = await ScriptModel.findById(scriptId).lean();

    if (!script) {
      throw new CustomError(404, "NOT_FOUND", { message: "Script not found" });
    }

    // Get pricing data based on post type
    let pricingData: any = null;
    const postType = script.type?.[0];

    if (postType === "SCRIPT" && script.script) {
      pricingData = script.script;
    } else if (postType === "SYNOPSIS" && script.synopsis) {
      pricingData = script.synopsis;
    } else if (postType === "STORY_BOARD" && script.story_borad) {
      pricingData = script.story_borad;
    } else {
      throw new CustomError(400, "INVALID_INPUT", {
        message: "Post not found or pricing data is missing",
      });
    }

    if (pricingData.sale_type !== "BIDDABLE") {
      throw new CustomError(400, "INVALID_INPUT", {
        message: "This post is not open for bidding",
      });
    }

    if (String(script.userId) === buyerId) {
      throw new CustomError(400, "INVALID_INPUT", {
        message: "You cannot place a bid on your own post",
      });
    }

    const minimumBid = Number(pricingData.minimum_bid || 0);
    if (amount < minimumBid) {
      throw new CustomError(400, "INVALID_INPUT", {
        message: `Bid amount should be at least ${minimumBid}`,
      });
    }

    const existingPendingBid = await BidModel.findOne({
      script_id: new mongoose.Types.ObjectId(scriptId),
      buyer_id: new mongoose.Types.ObjectId(buyerId),
      status: BidStatus.PENDING,
    }).lean();

    if (existingPendingBid) {
      throw new CustomError(400, "INVALID_INPUT", {
        message: "You already have a pending bid on this post",
      });
    }

    return await BidModel.create({
      script_id: new mongoose.Types.ObjectId(scriptId),
      buyer_id: new mongoose.Types.ObjectId(buyerId),
      amount,
      status: BidStatus.PENDING,
    });
  }

  async getReceivedBids(userId: string) {
    const scripts = await ScriptModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .select("_id")
      .lean();
    const scriptIds = scripts.map((script) => script._id);

    if (!scriptIds.length) return [];

    return await BidModel.find({ script_id: { $in: scriptIds } })
      .populate("buyer_id", "username email profile_url")
      .populate("script_id", "main_title type script synopsis story_borad")
      .sort({ createdAt: -1 })
      .lean();
  }

  async getPlacedBids(userId: string) {
    return await BidModel.find({
      buyer_id: new mongoose.Types.ObjectId(userId),
    })
      .populate(
        "script_id",
        "main_title type userId script synopsis story_borad",
      )
      .populate({
        path: "script_id",
        populate: { path: "userId", select: "username email profile_url" },
      })
      .sort({ createdAt: -1 })
      .lean();
  }

  async acceptBid(bidId: string, sellerId: string) {
    const bid = await BidModel.findById(bidId).lean();
    if (!bid) {
      throw new CustomError(404, "NOT_FOUND", { message: "Bid not found" });
    }

    const script = await ScriptModel.findById(bid.script_id).lean();
    if (!script) {
      throw new CustomError(404, "NOT_FOUND", { message: "Script not found" });
    }

    if (String(script.userId) !== sellerId) {
      throw new CustomError(403, "UNAUTHORIZED", {
        message: "You can only accept bids on your own scripts",
      });
    }

    await BidModel.updateMany(
      { script_id: bid.script_id, status: BidStatus.PENDING },
      { $set: { status: BidStatus.REJECTED } },
    );

    return await BidModel.findByIdAndUpdate(
      bidId,
      { status: BidStatus.ACCEPTED },
      { new: true },
    )
      .populate("buyer_id", "username email profile_url")
      .populate("script_id", "main_title")
      .lean();
  }

  async deleteBid(bidId: string, userId: string) {
    const bid = await BidModel.findById(bidId).lean();
    if (!bid) {
      throw new CustomError(404, "NOT_FOUND", { message: "Bid not found" });
    }

    const script = await ScriptModel.findById(bid.script_id).lean();
    const isBuyer = String(bid.buyer_id) === userId;
    const isSeller = script && String(script.userId) === userId;

    if (!isBuyer && !isSeller) {
      throw new CustomError(403, "UNAUTHORIZED", {
        message: "You are not allowed to delete this bid",
      });
    }

    return await BidModel.findByIdAndDelete(bidId).lean();
  }

  async getBid(bidId: string) {
    const bid = await BidModel.findById(bidId)
      .populate("buyer_id", "username email profile_url")
      .populate(
        "script_id",
        "main_title type userId script synopsis story_borad",
      )
      .populate({
        path: "script_id",
        populate: { path: "userId", select: "username email profile_url" },
      })
      .lean();

    if (!bid) {
      throw new CustomError(404, "NOT_FOUND", { message: "Bid not found" });
    }

    return bid;
  }

  async createPayment(
    userId: string,
    paymentMethod: PaymentMethod,
    options: { bidId?: string; postId?: string },
  ) {
    let scriptId = "";
    let amount = 0;
    let reason = "";

    if (options.bidId) {
      const bid = await BidModel.findById(options.bidId).lean();

      if (!bid) {
        throw new CustomError(404, "NOT_FOUND", { message: "Bid not found" });
      }

      if (String(bid.buyer_id) !== userId) {
        throw new CustomError(403, "UNAUTHORIZED", {
          message: "You can only pay for your own accepted bid",
        });
      }

      if (bid.status !== BidStatus.ACCEPTED) {
        throw new CustomError(400, "INVALID_INPUT", {
          message: "Only accepted bids can be paid",
        });
      }

      scriptId = String(bid.script_id);
      amount = Number(bid.amount || 0);
      reason = "Bid purchase";
    } else if (options.postId) {
      const script = await ScriptModel.findById(options.postId).lean();

      if (!script) {
        throw new CustomError(404, "NOT_FOUND", {
          message: "Script not found",
        });
      }

      if (String(script.userId) === userId) {
        throw new CustomError(400, "INVALID_INPUT", {
          message: "You cannot buy your own post",
        });
      }

      const postType = script.type?.[0];
      const pricingData =
        postType === "SCRIPT"
          ? script.script
          : postType === "SYNOPSIS"
            ? script.synopsis
            : script.story_borad;

      if (!pricingData) {
        throw new CustomError(400, "INVALID_INPUT", {
          message: "Pricing details not found for this post",
        });
      }

      // Allow checkout with postId on biddable posts by resolving buyer's accepted bid.
      if (pricingData.sale_type === "BIDDABLE") {
        const acceptedBid = await BidModel.findOne({
          script_id: new mongoose.Types.ObjectId(String(script._id)),
          buyer_id: new mongoose.Types.ObjectId(userId),
          status: BidStatus.ACCEPTED,
        }).lean();

        if (!acceptedBid) {
          throw new CustomError(400, "INVALID_INPUT", {
            message: "Accepted bid not found for this post",
          });
        }

        scriptId = String(script._id);
        amount = Number(acceptedBid.amount || 0);
        reason = "Bid purchase";
      } else {
        scriptId = String(script._id);
        amount = Number(pricingData.price || 0);
        reason = "Direct purchase";
      }
    } else {
      throw new CustomError(400, "INVALID_INPUT", {
        message: "Either bidId or postId is required",
      });
    }

    if (!amount || amount <= 0) {
      throw new CustomError(400, "INVALID_INPUT", {
        message: "Invalid payment amount",
      });
    }

    const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const purchase = await PurchaseModel.create({
      user_id: new mongoose.Types.ObjectId(userId),
      script_id: new mongoose.Types.ObjectId(scriptId),
      price: amount,
      payment_method: paymentMethod,
      payment_status: "COMPLETED",
      reason,
      transaction_id: transactionId,
    });

    return purchase;
  }

  async getBuyerPayments(userId: string) {
    return await PurchaseModel.find({
      user_id: new mongoose.Types.ObjectId(userId),
    })
      .populate("script_id", "main_title type userId")
      .populate({
        path: "script_id",
        populate: { path: "userId", select: "username email profile_url" },
      })
      .sort({ createdAt: -1 })
      .lean();
  }

  async getSellerPayments(sellerId: string) {
    const sellerScripts = await ScriptModel.find({
      userId: new mongoose.Types.ObjectId(sellerId),
    })
      .select("_id")
      .lean();

    const scriptIds = sellerScripts.map((script) => script._id);
    if (!scriptIds.length) {
      return [];
    }

    return await PurchaseModel.find({
      script_id: { $in: scriptIds },
    })
      .populate("script_id", "main_title type userId")
      .populate("user_id", "username email profile_url")
      .sort({ createdAt: -1 })
      .lean();
  }
}
