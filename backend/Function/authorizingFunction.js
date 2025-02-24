const { promisify } = require("util");
const { Post, User } = require("../db/dbSchema.js");
const jwt = require("jsonwebtoken");
const catchAsync = require("./utils/catchAsync.js");
const AppError = require("./utils/appError.js");
const sendEmail = require("./utils/email");
const crypto = require("crypto");

const signToken = (id) => {
  // will need the payload, secret, expires duration
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });

  res.status(statusCode).json({
    status: "success",
    token,
    user: user.name,
    title: user.title,
    _id: user._id,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body); // create the data in the db

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, pwd } = req.body;

  // check the user exist
  if (!email || !pwd) {
    throw new AppError("Your email or password is not filled!", 400);
  }

  // check the pwd is correct
  const user = await User.findOne({ email }).select("+pwd"); // because the default password is not selected

  if (!user || !(await user.correctPassword(pwd, user.pwd))) {
    throw new AppError("Incorrect email or password", 401);
  }

  // if everything is ok, send the token
  createSendToken(user, 200, res);
});

exports.logout = (req,res) => {
  res.cookie(
    'jwt', 'logged out' ,{
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true 
    }
  );
  res.status(200).json({
    status: 'success',
  })
}

exports.protect = catchAsync(async (req, res, next) => {
  // get the token
  let token = null;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
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

exports.restrictTo = (...args) => {
  // 回傳一個函式
  return catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if (
      !args.includes(req.user.title) &&
      !(req.user._id == post.author[0]._id)
    ) {
      throw new AppError(
        "You do not have permission to perform this action.",
        403
      );
    }

    next();
  });
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // get user based on posted email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw new AppError(`There is no email address: ${req.body.email}`, 404);
  }

  // generate the random reset token
  const resetToken = user.createPasswordResetoken();
  await user.save({ validateBeforeSave: false });

  // send it to user's email
  const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL} \n If you didn't forget your password, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Your password reset token (valid for 10 mins)`,
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token has been sent.",
    });
  } catch (err) {
    user.pwdResetToken = undefined;
    user.pwdResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    throw new AppError(
      "There was an error sending the email, please contact the maintainer."
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // get user based on the token
  const hashedToken = crypto // 解密
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    pwdResetToken: hashedToken,
    pwdResetExpires: { $gt: Date.now() },
  });

  // if token has not expired and there is user, set the new password
  if (!user) {
    throw new AppError(
      "Invalid access: your resetToken is wrong or expired.",
      400
    );
  }

  // using middleware in dbSchema to update changePasswordAt property for the current user
  user.pwd = req.body.pwd;
  user.pwdResetToken = undefined;
  user.pwdResetExpires = undefined;
  await user.save();

  // log the user in, send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // for the user has login (the pre middleware is protect)

  // get user from collection
  const user = await User.findById(req.user.id).select("+pwd");

  // check if POSTed correct password is correct
  if (
    !user ||
    !(await user.correctPassword(req.body.currentPassword, user.pwd))
  ) {
    throw new AppError(
      "the old password is not correct, please try again",
      401
    );
  }

  // if the password is correct, update the password
  user.pwd = req.body.password;
  await user.save();

  // log user in, send JWT
  createSendToken(user, 200, res);
});

// To let the webpage show the "login" or "userName"
exports.isLoggedin = async (req, res, next) => {

    // get the token
    if (req.cookies.jwt) {
      try{
      // verify the token (the error message is handled in ./errorFunction.js)
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      ); // promisify 使其可以 return 一個 promise，而不用再寫回調函數

      // check user still exists
      const userAlive = await User.findById(decoded.id); // also verify the id is valid

      if (!userAlive){return next();}

      // check user change the password after the JWT was issued
      if (userAlive.changePasswordAfter()) {
        return next();
      }

      // pass the req to the next middleware
      res.status(200).json({
        status: "success",
        name: userAlive.name,
        email: userAlive.email,
        title:userAlive.title,
        _id:userAlive._id
      });
    } 
      catch(err){
        return next();
      }
    }
next();
};
