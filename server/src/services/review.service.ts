import ReviewModel from "../repository/model/review.model";
import { CustomError } from "../utils/customError";

export class ReviewService {
  async createReview(data: {
    reviewer_id: string;
    seller_id: string;
    script_id: string;
    payment_id: string;
    rating: number;
    comment?: string;
  }) {
    const existing = await ReviewModel.findOne({ payment_id: data.payment_id });
    if (existing) {
      throw new CustomError(400, "DUPLICATE_REVIEW", {
        message: "You have already reviewed this purchase",
      });
    }
    return await ReviewModel.create(data);
  }

  async getReviewsBySeller(sellerId: string) {
    return await ReviewModel.find({ seller_id: sellerId })
      .populate("reviewer_id", "username profile_url")
      .populate("script_id", "main_title")
      .sort({ createdAt: -1 })
      .lean();
  }

  async getReviewsByReviewer(reviewerId: string) {
    return await ReviewModel.find({ reviewer_id: reviewerId })
      .populate("seller_id", "username profile_url")
      .populate("script_id", "main_title")
      .sort({ createdAt: -1 })
      .lean();
  }

  async getReviewByPayment(paymentId: string) {
    return await ReviewModel.findOne({ payment_id: paymentId }).lean();
  }

  async getSellerRating(sellerId: string) {
    const reviews = await ReviewModel.find({ seller_id: sellerId }).lean();
    if (!reviews.length) return { average: 0, count: 0 };
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return {
      average: parseFloat((total / reviews.length).toFixed(1)),
      count: reviews.length,
    };
  }
}
