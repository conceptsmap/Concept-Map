import { NextFunction, Request, Response } from "express";
import { ReviewService } from "../services/review.service";

export class ReviewController {
  private readonly reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reviewer_id = req.user?.id;
      if (!reviewer_id) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized" });
      }

      const { seller_id, script_id, payment_id, rating, comment } = req.body;

      if (!seller_id || !script_id || !payment_id || !rating) {
        return res
          .status(400)
          .json({ status: "error", message: "Missing required fields" });
      }

      const parsedRating = Number(rating);
      if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        return res
          .status(400)
          .json({ status: "error", message: "Rating must be between 1 and 5" });
      }

      const review = await this.reviewService.createReview({
        reviewer_id,
        seller_id,
        script_id,
        payment_id,
        rating: parsedRating,
        comment,
      });

      res.status(201).json({
        status: "success",
        message: "Review submitted successfully",
        data: review,
      });
    } catch (error) {
      next(error);
    }
  };

  getSellerReviews = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { sellerId } = req.params;
      const reviews = await this.reviewService.getReviewsBySeller(sellerId);
      res.status(200).json({ status: "success", data: reviews });
    } catch (error) {
      next(error);
    }
  };

  getMyWrittenReviews = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized" });
      }
      const reviews = await this.reviewService.getReviewsByReviewer(userId);
      res.status(200).json({ status: "success", data: reviews });
    } catch (error) {
      next(error);
    }
  };

  getReceivedReviews = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized" });
      }
      const reviews = await this.reviewService.getReviewsBySeller(userId);
      res.status(200).json({ status: "success", data: reviews });
    } catch (error) {
      next(error);
    }
  };

  checkReviewByPayment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { paymentId } = req.params;
      const review = await this.reviewService.getReviewByPayment(paymentId);
      res.status(200).json({ status: "success", data: review });
    } catch (error) {
      next(error);
    }
  };

  getSellerRating = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sellerId } = req.params;
      const rating = await this.reviewService.getSellerRating(sellerId);
      res.status(200).json({ status: "success", data: rating });
    } catch (error) {
      next(error);
    }
  };
}
