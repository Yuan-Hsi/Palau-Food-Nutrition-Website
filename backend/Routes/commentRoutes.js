const express = require("express");
const { getComments, postComment } = require("../Function/commentFunction");

const commentRoute = express.Router({ mergeParams: true });

commentRoute.route("/").get(getComments).post(postComment);

module.exports = commentRoute;
