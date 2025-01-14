import { Router } from "express";


// Controller
import { getCurrentUser, login, register, updateUser } from "../controllers/UserController.js";

// Middlewares
import validate from '../middlewares/handleValidation.js'
import{loginValidator, registerValidator, updateValidator} from '../middlewares/userValidations.js'
import authGuard from "../middlewares/authGuard.js";

const UserRouter = Router()


UserRouter.post('/register',registerValidator(), validate, register)

UserRouter.post('/login', loginValidator(), validate, login)

UserRouter.get('/profile', authGuard, getCurrentUser)

UserRouter.put('/', authGuard, updateValidator(), validate, updateUser)



UserRouter.get('/', (req, res) => {
    res.send('Users working')
    
})





export default UserRouter