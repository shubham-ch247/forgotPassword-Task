const { body } = require("express-validator");

const forgotValidation = [
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Please enter password.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 character long.")
    .not()
    .matches(/^$|\s+/)
    .withMessage("White space not allowed"),
];
module.exports = forgotValidation;