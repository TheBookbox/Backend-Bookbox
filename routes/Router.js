import { Router } from "express";
import UserRouter from "./UserRoutes.js";


const router = Router()

router.use('/api/users', UserRouter)


router.get('/', (req, res)=>{
    res.send('Api working')
})


export default router