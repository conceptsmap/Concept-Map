import { Router } from "express";
import { ReviewController } from "../../controllers/review.controller";
import jwtVerifyMiddleware from "../../middleware/jwtVerify";

export class ReviewRouter {
  public router: Router;
  private reviewController: ReviewController;

  constructor() {
    this.router = Router();
    this.reviewController = new ReviewController();
    this.initRoutes();
  }

  private initRoutes() {
    // Buyer submits a review
    this.router.post(
      "/",
      jwtVerifyMiddleware,
      this.reviewController.createReview,
    );

    // Reviews written by the logged-in buyer
    this.router.get(
      "/my",
      jwtVerifyMiddleware,
      this.reviewController.getMyWrittenReviews,
    );

    // Reviews received by the logged-in seller
    this.router.get(
      "/received",
      jwtVerifyMiddleware,
      this.reviewController.getReceivedReviews,
    );

    // Check if a specific purchase has been reviewed
    this.router.get(
      "/payment/:paymentId",
      jwtVerifyMiddleware,
      this.reviewController.checkReviewByPayment,
    );

    // Public: seller's aggregate rating
    this.router.get(
      "/seller/:sellerId/rating",
      this.reviewController.getSellerRating,
    );

    // Public: all reviews for a seller
    this.router.get(
      "/seller/:sellerId",
      this.reviewController.getSellerReviews,
    );
  }
}

const reviewRouter = new ReviewRouter();
export default reviewRouter.router;
