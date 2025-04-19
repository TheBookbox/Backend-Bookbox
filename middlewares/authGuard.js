import User from "../models/User.js";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const jwtSecret = process.env.JWT_PASS

const authGuard = async(req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    // check if header has a token
    if(!token){
        return res.status(401).json({erro: ['Acesso Negado.']})
    }

    // Check if token is valid

    try {
        const verified = jwt.verify(token, jwtSecret)

        req.user = await User.findById(verified.id).select('-password')

        next()

    } catch (error) {
        console.error(error);

        res.status(401).json({errors: ['Token invalido']})
        
    }
}

export default authGuard