const express = require("express");
const {
  createPost,
  getAllPost,
  editPost,
  deletPost,
  getPost,
} = require("../Function/postFunction");
const {
  protect: loginRequire,
  restrictTo,
} = require("../Function/authorizingFunction");

const postRouter = express.Router();

postRouter
  .route("/")
  .post(loginRequire, restrictTo("admin"), createPost)
  .get(getAllPost);

postRouter
  .route("/:id")
  .get(getPost)
  .put(loginRequire, restrictTo("admin"), editPost)
  .delete(loginRequire, restrictTo("admin"), deletPost);

module.exports = postRouter;
