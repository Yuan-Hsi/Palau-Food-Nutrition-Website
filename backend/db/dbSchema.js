const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, "The NAME is needed."],
  },
  title: {
    type: String,
    default: "Regular",
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

exports.User = mongoose.model("User", userSchema);
exports.Post = mongoose.model("Post", postSchema);
