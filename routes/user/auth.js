const express = require("express");
const {
  forgotPasswordAction,
  newPassword,
  newPasswordAction,
  signup,
} = require("../../controllers/auth");
const authRouter = express.Router();

authRouter.post("/register", signup);
authRouter.post("/forgotPassword", forgotPasswordAction);
// new password
authRouter.get("/newpassword/:id/:token", newPassword);
authRouter.post("/newpassword/:id/:token", newPasswordAction);

module.exports = authRouter;
