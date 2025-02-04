const { User } = require("../db/dbSchema.js");

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body); // create the data in the db
    res.status(201).json({
      status: "success",
      data: {
        message: `the user ${req.body.name} is create successfully!`,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
