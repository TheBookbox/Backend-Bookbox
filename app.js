import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDb from './config/db.js'
import router from './routes/Router.js'

dotenv.config()

const PORT = process.env.PORT
const HOST = process.env.HOST
const app = express()


// Cors solve
app.use(cors({credentials: true, origin: '*'
}))

// DB
connectDb()

// Config JSON e Form Data Response
app.use(express.json())
app.use(express.urlencoded({extended: true}))


// Routes

app.use(router)



app.listen(PORT, HOST, () => console.log(`Server iniciado: ${HOST}:${PORT}`))


