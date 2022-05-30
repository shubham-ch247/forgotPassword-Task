const { Router } = require("express");
const userAuthRouter = require("./user");
const router = Router();
router.use("/user", userAuthRouter);
module.exports = router;