import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'


dotenv.config()

const jwtSecret = process.env.JWT_PASS

const generateToken = (id) => {
    return jwt.sign({id}, jwtSecret, {expiresIn: '7d'})
}


// Register

const register = async(req, res)=>{
    const{name, email, password } = req.body

    const user = await User.findOne({email})

    // Se tiver usuario retorna 409 Conflict informando que o email já está em uso.
    if(user){
        return res.status(409).json({erro: ['Esse email já está em uso.']})
    }
    // 

    // Gerar Hash com Bcrypt
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt)


    // Novo usuario
    const newUser = await User.create({
        name,
        email,
        password: passwordHash
    })

    // Verificar se ocorreu tudo certo
    if(!newUser){
        return res.status(422).json({erro: ['Algo deu errado, tente novamente mais tarde.']})
    }

    res.status(201).json({
        _id: newUser._id,
        token: generateToken(newUser._id)
    })







}


const login = async(req, res) => {
    const{email, password} = req.body

    const user = await User.findOne({email})

    // Checar se o usuário existe
    if(!user) return res.status(404).json({erro: ['Usuário não encontrado.']})

    // Checar se a senha está errada
    if(!await bcrypt.compare(password, user.password)){
        return res.status(422).json({erro: ['Senha incorreta.']})
    }

    // Retornar o usuario com o token

    res.status(201).json({
        _id: user._id,
        token: generateToken(user._id)
    })
    
}


export {
    register,
    login
}

