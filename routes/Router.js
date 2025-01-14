import { Router } from "express";
import UserRouter from "./UserRoutes.js";
import ReviewRouter from "./ReviewRouter.js";


const router = Router()

router.use('/api/users', UserRouter)
router.use('/api/review', ReviewRouter)

router.get('/', (req, res)=>{
    res.send('Api working')
})


export default router