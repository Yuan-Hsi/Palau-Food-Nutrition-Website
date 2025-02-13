const { Comment } = require("../db/dbSchema");
const catchAsync = require("./utils/catchAsync");
const AppError = require("./utils/appError");

exports.getComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.find();

  res.status(200).json({
    status: "success",
    result: comments.length,
    data: {
      comments,
    },
  });
});

exports.postComment = catchAsync(async (req, res, next) => {
  const newComment = await Comment.create(req.body);

  res.status(200).json({
    status: "success",
    message: `${newComment.name} said that '${newComment.comment}'`,
  });
});
