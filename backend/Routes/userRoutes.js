const express = require("express");
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
} = require("../Function/authorizingFunction");

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/forgotPassword", forgotPassword);
authRouter.patch("/resetPassword/:token", resetPassword);
authRouter.patch("/updateMyPassword", protect, updatePassword);
module.exports = authRouter;
