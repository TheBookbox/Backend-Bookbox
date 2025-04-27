import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'


dotenv.config()

const jwtSecret = process.env.JWT_PASS

const generateToken = (id) => {
    return jwt.sign({id}, jwtSecret, {expiresIn: '7d'})
}

const register = async(req, res)=>{
    let{name, email, password } = req.body

    email = email.toLowerCase()
    name = name.charAt(0).toUpperCase() + name.slice(1)

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

const updateUser = async(req, res) => {
    const{name, password} = req.body

    const reqUser = req.user
   
    const user = await User.findById(new mongoose.Types.ObjectId(reqUser._id))

    if(name){
        user.name = name
    }

    if(password){
        const salt = await bcrypt.genSalt()
        const passportHash = await bcrypt.hash(password, salt)

        user.password = passportHash
    }

    await user.save()

    const userObj = user.toObject()
    delete userObj.password

    res.status(200).json(userObj)
}

const getCurrentUser = async(req, res) => {
    const user = req.user
    res.status(200).json(user)
}

const getUserById = async(req, res) => {
    const{id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: ['ID inválido'] })
    }
    
    const user = await User.findById(new mongoose.Types.ObjectId(id))

    

    if(!user){
        res.status(404).json({erro: ['Nenhum usuário encontrado.']})
    }else{
        const userObj = user.toObject()
        delete userObj.password

        res.status(200).json(userObj)
    
    }

       

}


const followUser = async(req, res) => {
    const{id} = req.params
    const reqUser = req.user

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: ['ID inválido'] })
    }

    const user = await User.findById(new mongoose.Types.ObjectId(id))

    if(user.followers.includes(reqUser._id)){
        return res.status(422).json({error: ['Você já segue esse usuário.']})
    }

    if(user._id.equals(reqUser._id)){
        return res.status(422).json({error: ['Você não pode se seguir!']})
    }

    const userAuth = await User.findById(new mongoose.Types.ObjectId(reqUser._id))


    userAuth.following.push({
        userId: id,
        email: user.email
    })

    user.followers.push({
        userId: reqUser._id,
        email: userAuth.email
    })
    
    
    user.save()
    .then(saved => 
        userAuth.save(),
        res.status(200).json(
           { userId: user._id,
            email: user.email
        }
            
        ))
    .catch(e => {
        console.error(e);
        res.status(500).json({error: ['Algo deu errado']})
        
    })
}

const unfollowUser = async(req, res) => {
    const{id} = req.params
    const reqUser = req.user

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: ['ID inválido'] })
    }

    const user = await User.findById(new mongoose.Types.ObjectId(id))

    const userAuth = await User.findById(new mongoose.Types.ObjectId(reqUser._id))

    if(user._id.equals(reqUser._id)){
        return res.status(422).json({error: ['Queria parar de me seguir, mas onde eu ia eu estava.']})
    }

    user.followers = user.followers.filter(filter => filter.email != reqUser.email)

    userAuth.following = userAuth.following.filter(filter => filter.userId != id)

    user.save()
    .then(saved => 
        userAuth.save(),
        res.status(200).json(
            { userId: user._id,
             email: user.email
         }))
    .catch(e => {
        console.error(e);
        res.status(500).json({error: ['Algo deu errado']})
        
    })
    








}

const getFollowings = async(req, res) => {
    const reqUser = req.user


    if (!mongoose.Types.ObjectId.isValid(reqUser._id)) {
        return res.status(400).json({ error: ['ID inválido'] })
    }

    const user = await User.findById(new mongoose.Types.ObjectId(reqUser._id))

    if(!user){
        return res.status(404).json({error: ['Usuário não encontrado.']})
    }

    res.status(200).json(user.following)
}

const getFollowers = async(req, res) => {
    const reqUser = req.user

    if (!mongoose.Types.ObjectId.isValid(reqUser._id)) {
        return res.status(400).json({ error: ['ID inválido'] })
    }

    const user = await User.findById(new mongoose.Types.ObjectId(reqUser._id))

    if(!user){
        return res.status(404).json({error: ['Usuário não encontrado.']})
    }

    res.status(200).json(user.followers)
}




export {
    register,
    login,
    getCurrentUser,
    getUserById,
    updateUser,

    followUser,
    unfollowUser,
    getFollowings,
    getFollowers,
    
}

