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
    default: "",
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
  authType: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },
  pwd: {
    type: String,
    required: function () {
      return this.authType === "local"; // Only required for local authentication
    },
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
  favorite: {
    type: Array,
    select: false,
    default: [],
  },
  dislike: {
    type: Array,
    select: false,
    default: [],
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
  if (this.authType !== "local" || !this.isModified("pwd")) return next();

  this.pwd = await bcrypt.hash(this.pwd, 14);

  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("pwd") || this.isNew) return next();

  this.pwdChangeAt = Date.now() - 1000; // Prevent the token is create after defining this proprerty

  next();
});

// Update the count of food's like and dislike
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  const userId = this.getQuery()._id;

  if (!update.favorite && !update.dislike) return next();

  try {
    const user = await this.model.findById(userId).select("+favorite +dislike");
    if (!user) return next();

    const Food = mongoose.model("Food", foodSchema);
    let setShort, longArr, updateCount;

    if (update.favorite) {
      const originFav = user.favorite || [];
      const newFav = update.favorite || [];

      if (originFav.length < newFav.length) {
        // add favorite
        setShort = new Set(originFav);
        longArr = newFav;
        updateCount = 1;
      } else {
        // remove favorite
        setShort = new Set(newFav);
        longArr = originFav;
        updateCount = -1;
      }

      const updateFood = longArr.filter((name) => !setShort.has(name)); // find the difference
      await Food.updateMany({ name: updateFood }, { $inc: { likes: updateCount } });
    } else {
      const originDis = user.dislike || [];
      const newDis = update.dislike || [];

      if (originDis.length < newDis.length) {
        // add favorite
        setShort = new Set(originDis);
        longArr = newDis;
        updateCount = 1;
      } else {
        // remove favorite
        setShort = new Set(newDis);
        longArr = originDis;
        updateCount = -1;
      }

      const updateFood = longArr.filter((name) => !setShort.has(name)); // find the difference
      await Food.updateMany({ name: updateFood }, { $inc: { dislikes: updateCount } });
    }
  } catch (error) {
    console.error("Error updating food likes/dislikes:", error);
    next(error);
  }
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
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  if (this.authType !== "local") return false;
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
postSchema.pre("findOneAndUpdate", async function (next) {
  const userModel = mongoose.model("User", userSchema);
  const post = await this.model.findById(this.getQuery()["_id"]);

  if (post && post.author) {
    const authorInfo = await userModel.findById(post.author[0]).select("-__v -email");
    this._update.author = [authorInfo];
  }

  next();
});

// delete related comments
postSchema.pre(["findOneAndDelete", "findByIdAndDelete"], async function (next) {
  const postId = this.getQuery()["_id"];
  try {
    await mongoose.model("Comment", commentSchema).deleteMany({ post: postId });
  } catch (error) {
    console.error("Error deleting relavent comments:", error);
  }
  next();
});

postSchema.index({ title: "text", content: "text" });

exports.Post = mongoose.model("Post", postSchema);

// ------------ FOR MENU CALEDAR ---------------

// Category Schema
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    color: { type: String, required: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Food Schema
const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
});

// Calendar Schema
const calendarSchema = new mongoose.Schema({
  schoolType: {
    type: String,
    enum: ["Elementary School", "High School", "Others"],
    default: "Elementary School",
  },
  date: { type: Date, required: true },
  foods: [{ type: mongoose.Schema.Types.ObjectId, ref: "Food" }], // 用 food_id 來引用 foods
});

categorySchema.virtual("foods", {
  // virtual populate
  ref: "Food",
  foreignField: "category_id",
  localField: "_id",
});

// delete related foods
categorySchema.pre(["findOneAndDelete", "findByIdAndDelete"], async function (next) {
  const categoryId = this.getQuery()["_id"];
  try {
    await mongoose.model("Food", foodSchema).deleteMany({ category_id: categoryId });
  } catch (error) {
    console.error("Error deleting relavent foods:", error);
  }
  next();
});

exports.Category = mongoose.model("Category", categorySchema);
exports.Food = mongoose.model("Food", foodSchema);
exports.Calendar = mongoose.model("Calendar", calendarSchema);

// ------------ FOR THE FORM AUTHORIZATION ---------------
const schoolSchema = mongoose.Schema(
  {
    school: {
      type: String,
      required: [true, "The school name can not be blank."],
      unique: true,
    },
    cooker: {
      type: Array,
    },
    inventoryLink: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

exports.School = mongoose.model("School", schoolSchema);
