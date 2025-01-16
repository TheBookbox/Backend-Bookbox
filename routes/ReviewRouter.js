import { Router } from "express";
import authGuard from "../middlewares/authGuard.js";
import { commentReview, deleteReview, getAllReviews, getFollowingReview, getReviewById, getUsersReview, insertReview, likeReview, updateReview } from "../controllers/ReviewController.js";
import { commentValidation, reviewValidation } from "../middlewares/reviewValidations.js";
import validate from "../middlewares/handleValidation.js";

const ReviewRouter = Router()

ReviewRouter.get('/', authGuard, getAllReviews)
ReviewRouter.get('/:id', authGuard, getReviewById)
ReviewRouter.get('/books/:id', authGuard, getUsersReview)

ReviewRouter.get('/following/books/', authGuard, getFollowingReview)

ReviewRouter.post('/', authGuard, reviewValidation(), validate, insertReview)
ReviewRouter.delete('/:id', authGuard, deleteReview)

ReviewRouter.put('/books/:id', authGuard, reviewValidation(), validate, updateReview)
ReviewRouter.put('/books/like/:id', authGuard, likeReview)
ReviewRouter.put('/books/comment/:id', authGuard, commentValidation(), validate, commentReview)



export default ReviewRouter