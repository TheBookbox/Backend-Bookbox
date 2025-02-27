import mongoose from "mongoose";
import { Schema } from "mongoose";


const reviewSchema = new Schema({
    stars: Number,
    userId: mongoose.ObjectId,
    text: String,
    thumbnail: String,
    bookName: String,
    likes: Array,
    comments: Array,
    userName: String,
    bookId: String
},{
    timestamps: true
})


const Review = mongoose.model('Review', reviewSchema)

export default Review