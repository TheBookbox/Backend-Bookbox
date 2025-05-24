import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

const connectDB = process.env.DB_CONNECT

const connectDb = async()=>{
    try {
        console.log('conectando...');
        
        const dbConnect = await mongoose.connect(`${connectDB}`)
        console.log('Conectado ao banco');
        return dbConnect
        
    } catch (error) {
        console.log(error)

    }
}

export default connectDb
