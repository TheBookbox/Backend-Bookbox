import { Router } from "express";
import authGuard from "../middlewares/authGuard.js";
import { deleteReview, getAllReviews, getReviewById, getUsersReview, insertReview, updateReview } from "../controllers/ReviewController.js";
import { reviewValidation } from "../middlewares/reviewValidations.js";
import validate from "../middlewares/handleValidation.js";

const ReviewRouter = Router()

ReviewRouter.get('/', authGuard, getAllReviews)
ReviewRouter.get('/:id', authGuard, getReviewById)
ReviewRouter.get('/books/:id', authGuard, getUsersReview)

ReviewRouter.post('/', authGuard, reviewValidation(), validate, insertReview)
ReviewRouter.delete('/:id', authGuard, deleteReview)

ReviewRouter.put('/books/:id', authGuard, reviewValidation(), validate, updateReview)



export default ReviewRouter