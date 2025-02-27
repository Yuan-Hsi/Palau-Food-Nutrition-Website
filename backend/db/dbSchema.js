const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs"); // 即使相同，一樣輸出不同密鑰
const { use } = require("../app");
const crypto = require("crypto"); // 單純 Hash 密碼相同，輸出一樣密鑰

const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, "The NAME is needed."],
  },
  title: {
    type: String,
    enum: ["admin", "cooker", "student"], // limit the value
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
    select: false,
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
  pwdResetToken: {
    type: String,
  },
  pwdResetExpires: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

const commentSchema = mongoose.Schema(
  {
    timestamp: {
      type: Date,
      required: [true, "The timestamp field can not be blank."],
      default: Date.now(),
    },
    comment: {
      type: String,
      required: [true, "Comment field can not be blank."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "must have someone write this comment!"],
    },
    visibility: {
      type: Boolean,
      default: true,
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: [true, "Comment must belong to a post"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const postSchema = mongoose.Schema(
  {
    timestamp: {
      type: Date,
      required: [true, "The timestamp field can not be blank."],
      default: Date.now(),
    },
    //author: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    author: {
      type: Array,
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// pre middleware - the middleware between the require and stroing the document! (but when you using "update" than "save" this will not work!!)
userSchema.pre("save", async function (next) {
  if (!this.isModified("pwd")) return next();

  this.pwd = await bcrypt.hash(this.pwd, 14);

  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("pwd") || this.isNew) return next();

  this.pwdChangeAt = Date.now() - 1000; // Prevent the token is create after defining this proprerty

  next();
});

userSchema.pre(/^find/, function (next) {
  // include findAndUpdate, findAndDelete....
  this.find({ active: { $ne: false } });
  next();
});

postSchema.virtual("comments", {
  // virtual populate
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
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

userSchema.methods.createPasswordResetoken = function () {
  // 用於連到一個不會被其他人知道的前端介面
  const resetToken = crypto.randomBytes(32).toString("hex"); // 要寄出 Real token
  this.pwdResetToken = crypto // 存在資料庫的是 hash 過的密鑰
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.pwdResetExpires = Date.now() + 10 * 60 * 1000; // 還需要再呼叫的那邊做，.save() 才會真的儲存！

  return resetToken;
};

exports.User = mongoose.model("User", userSchema);
exports.Comment = mongoose.model("Comment", commentSchema);

// embed the author
postSchema.pre("save", async function (next) {
  const userModel = mongoose.model("User", userSchema);
  this.author = await userModel.findById(this.author[0]).select("-__v -email");

  next();
});

postSchema.index({ title: "text", content: "text" });

exports.Post = mongoose.model("Post", postSchema);
