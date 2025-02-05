const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { use } = require("../app");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, "The NAME is needed."],
  },
  title: {
    type: String,
    require: [true, "Are you a MOE admin/Cooker/Student ?"],
  },
  school: {
    type: String,
    require: [true, "Please input the school you are in."],
  },
  email: {
    type: String,
    required: [true, "The email field can not be blank."],
    unique: [true, "Your email is been used."],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email "],
  },
  pwd: {
    type: String,
    required: [true, "The pwd field can not be blank."],
    minlength: 8,
    select: false,
  },
  pwdChangeAt: {
    type: Date,
  },
});

const commentSchema = mongoose.Schema({
  timestamp: {
    type: Date,
    required: [true, "The timestamp field can not be blank."],
    default: Date.now(),
  },
  name: {
    type: String,
  },
  content: {
    type: String,
  },
  visibility: {
    type: Boolean,
    defualt: true,
  },
});

const postSchema = mongoose.Schema({
  timestamp: {
    type: Date,
    required: [true, "The timestamp field can not be blank."],
    default: Date.now(),
  },
  author: {
    type: String,
    required: [true, "Please give us your name."],
  },
  title: {
    type: String,
    required: [true, "The title field can not be blank."],
  },
  content: {
    type: String,
  },
  setNotice: {
    type: Boolean,
  },
  forCooker: {
    type: Boolean,
    default: false,
  },
  forStudent: {
    type: Boolean,
    default: false,
  },
  comment: {
    type: commentSchema,
    default: {},
  },
});

// pre middleware - the middleware between the require and stroing the document!
userSchema.pre("save", async function (next) {
  if (!this.isModified("pwd")) return next();

  this.pwd = await bcrypt.hash(this.pwd, 14);

  next();
});

// using the instance method (which can be used by the all 'users' documents)
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// to detect the password is changed after token was build or not?
userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.pwdChangeAt) {
    // There is no pwdChangeAt in defaul.
    const transformTimestamp = parseInt(this.pwdChangeAt.getTime() / 1000, 10);

    return transformTimestamp > JWTTimestamp;
  }

  return false;
};

exports.User = mongoose.model("User", userSchema);
exports.Post = mongoose.model("Post", postSchema);
