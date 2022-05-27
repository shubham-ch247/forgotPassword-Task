const express = require("express");
const authRouter = require("./auth");
const userAuthRouter = express.Router();
userAuthRouter.use("/", authRouter);
module.exports = userAuthRouter;