import dotenv from 'dotenv'

dotenv.config()

const apikey = process.env.API_GOOGLEBOOKS

const apiBook = `https://www.googleapis.com/books/v1/volumes?q=`

export const searchBook = async(query) => {
    const res = await fetch(`${apiBook}${query}&key=${apikey}`)
    .then(res => res.json())
    .catch(e => e)

    return res
}