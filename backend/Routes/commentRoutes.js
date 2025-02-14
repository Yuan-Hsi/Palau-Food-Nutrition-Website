const express = require("express");
const {
  getComments,
  postComment,
  deleteComment,
  editComment,
  validation,
} = require("../Function/commentFunction");
const { protect } = require("../Function/authorizingFunction");

const commentRoute = express.Router({ mergeParams: true });

commentRoute.route("/").get(getComments).post(protect, postComment);

commentRoute
  .route("/:id")
  .delete(protect, validation, deleteComment)
  .patch(protect, validation, editComment);

module.exports = commentRoute;
