import mongoose from "mongoose";
import { Schema } from "mongoose";


const reviewSchema = new Schema({
    stars: Number,
    review: String
},{
    timestamps: true
})


const Review = mongoose.model('Review', reviewSchema)

export default Review