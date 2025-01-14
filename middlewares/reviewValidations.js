import { body } from "express-validator";

const reviewValidation = () => {
    return [
        body('stars')
        .isNumeric()
        .isInt({min: 1, max: 5})
        .withMessage('A nota deve ser um número de 1 a 5'),

        
        body('text')
        .optional()
        .isLength({min: 4})
        .withMessage('Texto deve conter mais de 4 caracteres.')


    ]
}

export{
    reviewValidation
}