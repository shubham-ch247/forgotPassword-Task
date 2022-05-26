const express = require("express");
const {
  forgotPassword,
  newPassword,
  signup,
  verifyLink,
} = require("../../controllers/auth");
const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/forgotPassword", forgotPassword);
// new password
authRouter.get("/newpassword/:id/:token", verifyLink);
authRouter.post("/newpassword/:id/:token", newPassword);

module.exports = authRouter;