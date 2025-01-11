import mongoose from "mongoose";
import { Schema } from "mongoose";


const userSchema = new Schema({
    name: String,
    email: String,
    password: String
})



const User = mongoose.model('User', userSchema)


export default User