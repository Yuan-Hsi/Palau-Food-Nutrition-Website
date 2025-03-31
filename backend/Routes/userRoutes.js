const express = require("express");
// prettier-ignore
const {
  signup,
  login,
  googleLogin,
  googleValidate,
  forgotPassword,
  resetPassword,
  protect: loginRequire,
  updatePassword,
  restrictTo,
  isLoggedin,
  logout,
  formAccess
} = require("../Function/authorizingFunction");
const { getUsers, getAUser, updateMe, deleteMe, getPreference, eraseUser } = require("../Function/userFunction");
const { auth } = require("google-auth-library");

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/googleLogin", googleLogin);
authRouter.get("/logout", logout);
authRouter.get("/isLoggedin", isLoggedin);
authRouter.get("/getPreference", loginRequire, getPreference);
authRouter.get("/googleValidate", googleValidate);
authRouter.post("/forgotPassword", forgotPassword);
authRouter.patch("/resetPassword/:token", resetPassword);
authRouter.patch("/updateMyPassword", loginRequire, updatePassword);
authRouter.post("/formAccess/:formType", loginRequire, formAccess);

authRouter.get("/", loginRequire, restrictTo("admin"), getUsers);
authRouter.get("/:id", loginRequire, restrictTo("admin"), getAUser);
authRouter.patch("/updateMe", loginRequire, updateMe);
authRouter.delete("/eraseUser/:id", loginRequire, restrictTo("admin"), eraseUser);
authRouter.delete("/deleteMe", loginRequire, deleteMe);

module.exports = authRouter;
