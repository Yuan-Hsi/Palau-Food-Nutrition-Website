const { User } = require("../db/dbSchema");
const AppError = require("./utils/appError.js");
const catchAsync = require("./utils/catchAsync.js");
const APIFeatures = require("../Function/utils/APIFeatures.js");

const filterObj = function (obj, ...allowedFileds) {
  const result = {};
  Object.keys(obj).map((item) => {
    if (allowedFileds.includes(item)) result[item] = obj[item];
  });

  return result;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // update their email, name... (but they can not update anythingelse)
  const filteredBody = filterObj(req.body, "name", "email", "school", "favorite", "dislike");
  const info = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  }).select("+favorite +dislike"); // x: the update info,

  res.status(200).json({
    status: "success",
    data: {
      updated: filteredBody,
    },
  });
});

exports.getUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query).filter();

  const users = await features.query;

  res.status(200).json({
    status: "success",
    result: users.length,
    data: {
      users,
    },
  });
});

exports.getAUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) throw new AppError("The user is not found.", 404);

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.getPreference = catchAsync(async (req, res, next) => {
  if (!req.user) throw new AppError("The user is not found.", 404);

  res.status(200).json({
    status: "success",
    data: {
      favorite: req.user.favorite,
      dislike: req.user.dislike,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.eraseUser = catchAsync(async (req, res, next) => {
  console.log(req.params.id);
  await User.deleteOne({ _id: req.params.id });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
