const express = require("express");
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect: loginRequire,
  updatePassword,
  restrictTo,
  isLoggedin,
} = require("../Function/authorizingFunction");
const {
  getUsers,
  getAUser,
  updateMe,
  deleteMe,
} = require("../Function/userFunction");

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/isLoggedin", isLoggedin);
authRouter.post("/forgotPassword", forgotPassword);
authRouter.patch("/resetPassword/:token", resetPassword);
authRouter.patch("/updateMyPassword", loginRequire, updatePassword);

authRouter.get("/", loginRequire, restrictTo("admin"), getUsers);
authRouter.get("/:id", loginRequire, restrictTo("admin"), getAUser);
authRouter.patch("/updateMe", loginRequire, updateMe);
authRouter.delete("/deleteMe", loginRequire, deleteMe);

module.exports = authRouter;
