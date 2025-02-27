import { Router } from "express";


// Controller
import { followUser, getCurrentUser, getFollowers, getFollowings, getUserById, login, register, unfollowUser, updateUser } from "../controllers/UserController.js";

// Middlewares
import validate from '../middlewares/handleValidation.js'
import{loginValidator, registerValidator, updateValidator} from '../middlewares/userValidations.js'
import authGuard from "../middlewares/authGuard.js";

const UserRouter = Router()


UserRouter.post('/register',registerValidator(), validate, register)

UserRouter.post('/login', loginValidator(), validate, login)

UserRouter.get('/profile', authGuard, getCurrentUser)
UserRouter.get('/profile/:id', getUserById)

UserRouter.put('/', authGuard, updateValidator(), validate, updateUser)

UserRouter.put('/follow/:id', authGuard, followUser)
UserRouter.get('/following', authGuard, getFollowings)
UserRouter.get('/followers', authGuard, getFollowers)
UserRouter.put('/unfollow/:id', authGuard, unfollowUser)



UserRouter.get('/', (req, res) => {
    res.send('Users working')
    
})





export default UserRouter