const { promisify } = require("util");
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
    user: user.name,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // get the token
  let token = null;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token)
    throw new AppError(
      "You are not logged in! Please log in to get access.",
      401
    );

  // verify the token (the error message is handled in ./errorFunction.js)
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // promisify 使其可以 return 一個 promise，而不用再寫回調函數

  // check user still exists
  const userAlive = await User.findById(decoded.id); // also verify the id is valid

  if (!userAlive)
    throw new AppError(
      "Your id is not in the database. Are you sure your user profile is still alive?",
      401
    );

  // check user change the password after the JWT was issued
  if (userAlive.changePasswordAfter()) {
    throw new AppError(
      "You recently change the password, please login again!",
      401
    );
  }

  // pass the req to the next middleware
  req.user = userAlive;
  next();
});
