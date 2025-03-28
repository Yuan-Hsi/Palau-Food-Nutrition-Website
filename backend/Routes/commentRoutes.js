const express = require("express");
const { getPublicComments, getComments, postComment, deleteComment, editComment, validation } = require("../Function/commentFunction");
const { protect } = require("../Function/authorizingFunction");

const commentRoute = express.Router({ mergeParams: true });

commentRoute.route("/").get(getPublicComments).post(protect, postComment);
commentRoute.route("/public").get(getPublicComments);
commentRoute.route("/user").get(protect, getComments);

commentRoute.route("/:id").delete(protect, validation, deleteComment).patch(protect, validation, editComment);

module.exports = commentRoute;
