import mongoose from "mongoose";
import dotenv from 'dotenv'


const connectDb = async()=>{
    try {
        const dbConnect = await mongoose.connect('mongodb://127.0.0.1:27017/gamediary')
        console.log('Conectado ao banco');
        return dbConnect
        
    } catch (error) {
        console.log(error)

    }
}


export default connectDb
