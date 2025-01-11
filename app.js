import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDb from './config/db.js'
import router from './routes/Router.js'

dotenv.config()

const PORT = process.env.PORT
const app = express()


// Cors solve
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))

// DB
connectDb()

// Config JSON e Form Data Response
app.use(express.json())
app.use(express.urlencoded({extended: true}))


// Routes

app.use(router)






app.listen(PORT, () => console.log('Server iniciado na porta', PORT))


