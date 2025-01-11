import { body } from "express-validator";

const registerValidator = () => {
  return [
    body("name")
      .isString()
      .withMessage("O Nome é obrigatório.")
      .isLength({ min: 2 })
      .withMessage("O Nome precisa ter mais de 2 caracteres."),

    body("email")
      .isString()
      .withMessage("O email é obrigatório.")
      .isEmail()
      .withMessage("Formato de email incorreto."),

    body("password")
      .isString()
      .withMessage("A senha é obrigatória.")
      .isLength({ min: 6 })
      .withMessage("A senha precisa ter mais de 6 caracteres."),
  ];
};

const loginValidator = () => {
  return [
    body("email")
      .isString()
      .withMessage("O email é obrigatório.")
      .isEmail()
      .withMessage("Formato errado de email."),

    body("password").isString().withMessage("A senha é obrigatória."),
  ];
};

export { registerValidator, loginValidator };
