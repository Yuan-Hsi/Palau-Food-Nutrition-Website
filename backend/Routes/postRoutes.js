const express = require("express");
const {
  createPost,
  getAllPost,
  editPost,
  deletPost,
  getPost,
} = require("../Function/postFunction");
const { getComments, postComment } = require("../Function/commentFunction");
const {
  protect: loginRequire,
  restrictTo,
} = require("../Function/authorizingFunction");
const commentRouter = require("./commentRoutes");

const postRouter = express.Router();

postRouter.use("/:postId/comments", commentRouter);

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
