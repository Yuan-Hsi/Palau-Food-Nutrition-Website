const express = require("express");
const {
  createPost,
  getAllPost,
  editPost,
  deletPost,
  getPost,
} = require("../Function/postFunction");

const postRouter = express.Router();

postRouter.route("/").post(createPost).get(getAllPost);

postRouter.route("/:id").get(getPost).put(editPost).delete(deletPost);
module.exports = postRouter;
