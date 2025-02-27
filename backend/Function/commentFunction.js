const { Comment } = require("../db/dbSchema");
const catchAsync = require("./utils/catchAsync");
const AppError = require("./utils/appError");
const factory = require("./handleFunction");

exports.getComments = catchAsync(async (req, res, next) => {
  const comments = req.params.postId
    ? await Comment.find({ post: req.params.postId })
        .sort("timestamp")
        .populate("user")
    : await Comment.find().sort("timestamp").populate("user");

  res.status(200).json({
    status: "success",
    result: comments.length,
    data: {
      comments,
    },
  });
});

exports.postComment = catchAsync(async (req, res, next) => {
  if (!req.body.post) req.body.post = req.params.postId;
  req.body.user = req.user;
  const newComment = await Comment.create(req.body);

  res.status(200).json({
    status: "success",
    message: "Your comment is been sent.",
    data: {
      _id: newComment._id,
    },
  });
});

exports.validation = catchAsync(async (req, res, next) => {
  const theComment = await Comment.findById(req.params.id);

  if (!(req.user.title === "admin") && !(req.user._id === theComment.user)) {
    console.log("error");
    throw new AppError(
      "You do not have permission to perform this action.",
      403
    );
  }

  next();
});

exports.deleteComment = factory.deleteOne(Comment);
exports.editComment = factory.editOne(Comment);
