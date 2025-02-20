const { Post } = require("../db/dbSchema");
const APIFeatures = require("./utils/APIFeatures");
const AppError = require("./utils/appError");
const catchAsync = require("./utils/catchAsync");
const factory = require("./handleFunction");

exports.createPost = catchAsync(async (req, res, next) => {
  const newPost = await Post.create(req.body);

  res.status(201).json({
    status: "success",
    message: `the post with title '${req.body.title}' successfully create.`,
  });
});

exports.getAllPost = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Post.find(), req.query)
    .filter()
    .sort()
    .limitFields();

  const totalPosts = await features.query;
  features.paginate();
  const posts = await features.query;

  res.status(200).json({
    status: "success",
    totalResults: totalPosts.length,
    result: posts.length,
    data: {
      posts,
    },
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate("comments");

  // error handling
  if (!post) {
    // if it can't find the id, it will return null, which is false.
    return next(new AppError("The post is not found.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
});

exports.editPost = factory.editOne(Post);

exports.deletPost = factory.deleteOne(Post);

/*
exports.editPost = catchAsync(async (req, res, next) => {
  const update = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // 返回改後資料
    runValidators: true, // 會再跑一次 schema 確認
  });

  if (!update) {
    throw new AppError(`Can not find the post with id: ${req.params.id}`, 404);
  }

  res.status(200).json({
    status: "success",
    update,
  });
});

exports.deletPost = catchAsync(async (req, res, next) => {
  const del = await Post.findByIdAndDelete(req.params.id);

  if (!del) {
    throw new AppError(`Can not find the post with id: ${req.params.id}`, 404);
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
*/
