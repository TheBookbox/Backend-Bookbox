import mongoose from "mongoose";
import { Schema } from "mongoose";


const userSchema = new Schema({
    name: String,
    email: String,
    password: String,

    followers: Array, //Seguidores
    following: Array  //Seguindo
    

})



const User = mongoose.model('User', userSchema)


export default User