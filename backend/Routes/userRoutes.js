const express = require("express");
const { signup } = require("../Function/authorizingFunction");

const authRouter = express.Router();

authRouter.post("/signup", signup);
module.exports = authRouter;
