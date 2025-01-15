// import { body } from "express-validator";
const { body, validationResult } = require("express-validator");

export const loginValidation = [
  body("email").isEmail().withMessage("Please enter a valid email address"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 6 characters long"),
];
