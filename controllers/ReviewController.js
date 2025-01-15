import mongoose, { mongo } from "mongoose";
import User from "../models/User.js";
import Review from "../models/Review.js";
import { searchBook } from "../utils/GoogleApi.js";


const getAllReviews = async(req, res) => {
    const reviews = await Review.find({}).sort([['createdAt', -1]]).exec()

    return res.status(200).json(reviews)
}

const insertReview = async(req, res) => {
    const{bookId, stars, text} = req.body
    const reqUser = req.user

    const bookTrim = bookId.replace(/\s+/g, "")

    if(!bookId){
        return res.status(422).json({error: ['Escolha um livro']})
    }

    const data = await searchBook(bookTrim)

    if(data.totalItems == 0){
        return res.status(502).json({error: ['Não encontramos o livro selecionado.']})
    }

    const bookData = {
        title: data.items[0]?.volumeInfo?.title ?? '',
        authors: data.items[0]?.volumeInfo?.authors[0] ?? '',
        publishedDate: data.items[0]?.volumeInfo?.publishedDate ?? '',
        thumbnail: data.items[0]?.volumeInfo.imageLinks?.thumbnail ?? ''
    }

    const user = await User.findById(reqUser._id)

    // Create review 

    const newReview = await Review.create({
        stars: stars,
        userId: user._id,
        text: text,
        thumbnail: bookData.thumbnail
    })

    if(!newReview){
        return res.status(422).json({error: ['Algo deu errado, tente novamente.']})
    }


    res.status(200).json(newReview)
    
}

const deleteReview = async(req, res) => {
    const{id} = req.params
    const reqUser = req.user

    try {
        const review = await Review.findById(new mongoose.Types.ObjectId(id))

        if(!review) return res.status(404).json({error: ['Review não encontrada']})

        // Checar se a review pertence ao user

        if(!review.userId.equals(reqUser._id)){
            res.status(422).json({error: ['Algo deu errado, tente novamente.']})
        }

        await Review.findByIdAndDelete(review._id)

        res.status(200).json({id: review._id, message: 'Review excluída!'})

    } catch (error) {
        console.error(error);
        
    }

}

const getReviewById = async(req, res) => {
    const{id} = req.params

    const review = await Review.findById(new mongoose.Types.ObjectId(id))

    if(!review){
        return res.status(404).json({error: ['Review não encontrada!']})
    }

    res.status(200).json(review)
}

const getUsersReview = async(req, res) => {
    const{id} = req.params
    console.log(id);
    

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: ['ID inválido'] })
    }

    const review = await Review.find({userId: id}).sort([['createdAt', -1]]).exec()

    if(!review){
        return res.status(404).json({error: ['Algo deu errado.']})
    }

    res.status(200).json(review)

}

const updateReview = async(req, res) => {
    const{stars:newStars, text: newText} = req.body

    const{id} = req.params

    const reqUser = req.user

    const review = await Review.findById(new mongoose.Types.ObjectId(id))
    
    if(!reqUser._id.equals(review.userId)){
        return res.status(401).json({
            error: ['Você não tem permissão.'],

        })
    }

    if(newStars){
        review.stars = newStars

    }

    if(newText){
        review.text = newText
    }



    // Save changes
    await review.save()
    .then(reviewSaved => {
        res.status(200).json(reviewSaved)
    })
    .catch(e => {
        console.error(e);
        res.status(500).json({error: ['Erro ao atualizar.']})

    })

}

const likeReview = async(req, res) => {
    const{id} = req.params
    const reqUser = req.user

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: ['ID inválido'] })
    }

    const review = await Review.findById(new mongoose.Types.ObjectId(id))

    if(!review){
        return res.status(404).json({error: ['Review não encontrada!']})
    }

    if(review.likes.includes(reqUser._id)){
        return res.status(422).json({errors: 'Você já curtiu essa :)'})
    }

    
    review.likes.push(reqUser._id)

    await review.save().
    then(saved => res.status(200).json({message: 'Like enviado'}))
    .catch(e => {
        console.error(e);
        res.status(500).json({error: ['Algo deu errado.']})
        
    })


    
}

const commentReview = async(req, res) => {
    const{id} = req.params
    const{text} = req.body
    const reqUser = req.user

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: ['ID inválido'] })
    }

    const review = await Review.findById(new mongoose.Types.ObjectId(id))

    if(!review){
        return res.status(404).json({error: ['Review não encontrada!']})
    }

    if(!text){
        return res.status(422).json({error: ['O texto é obrigatório.']})
    }

    const data = {
        userId: reqUser._id,
        text,
        date: new Date().toLocaleDateString('pt-BR'),
        
    }

    review.comments.push(data)

    await review.save().
    then(saved => res.status(200).json({data, message: ['Comentário enviado']}))
    .catch(e => {
        console.error(e);
        res.status(500).json({error: ['Algo deu errado.']})
        
    })

   
}

export {
    insertReview,
    deleteReview,
    getAllReviews,
    getReviewById,
    getUsersReview,
    updateReview,
    likeReview,
    commentReview
}