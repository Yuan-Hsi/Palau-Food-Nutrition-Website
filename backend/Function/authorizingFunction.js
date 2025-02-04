const { User } = require("../db/dbSchema.js");
const jwt = require("jsonwebtoken");
const catchAsync = require("./utils/catchAsync.js");
const AppError = require("./utils/appError.js");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body); // create the data in the db

  const token = signToken(newUser._id); // ({payload}, secret)

  res.status(201).json({
    status: "success",
    token,
    data: {
      message: `the user ${req.body.name} is create successfully!`,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, pwd } = req.body;

  // check the user exist
  if (!email || !pwd) {
    throw new AppError("Your email or password is not filled!", 400);
  }

  // check the pwd is correct
  const user = await User.findOne({ email }).select("+pwd"); // because the default password is not selected

  console.log(user);

  if (!user || !(await user.correctPassword(pwd, user.pwd))) {
    throw new AppError("Incorrect email or password", 401);
  }

  // if everything is ok, send the token
  const token = signToken(user.id);
  res.status(200).json({
    status: "success",
    token,
  });
});
