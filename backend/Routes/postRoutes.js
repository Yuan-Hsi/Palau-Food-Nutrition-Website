const express = require("express");
const {
  createPost,
  getAllPost,
  editPost,
  deletPost,
  getPost,
} = require("../Function/postFunction");
const { protect: loginRequire } = require("../Function/authorizingFunction");

const postRouter = express.Router();

postRouter.route("/").post(createPost).get(getAllPost);

postRouter
  .route("/:id")
  .get(getPost)
  .put(loginRequire, editPost)
  .delete(loginRequire, deletPost);
module.exports = postRouter;
