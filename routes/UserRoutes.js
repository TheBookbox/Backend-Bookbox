import { Router } from "express";


// Controller
import { login, register } from "../controllers/UserController.js";

// Middlewares
import validate from '../middlewares/handleValidation.js'

import{loginValidator, registerValidator} from '../middlewares/userValidations.js'

const UserRouter = Router()


UserRouter.post('/register',registerValidator(), validate, register)

UserRouter.post('/login', loginValidator(), validate, login)



UserRouter.get('/', (req, res) => {
    res.send('Users working')
    
})





export default UserRouter