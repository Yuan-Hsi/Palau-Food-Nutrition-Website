const AppError = require("./utils/appError");

module.exports = (err, req, res, next) => {
  // if you use (err, req, res, next) express would know it's a error handler
  err.statusCode = err.statusCode || 500; // 500 means internal server error
  err.status = err.status || "error";

  let error = { ...err };

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });

  if (error.name === "JsonWebTokenError")
    throw new AppError("Invalid token please login again.", 401);
  if (error.name === "TokenExpiredError")
    throw new AppError("The token is expired, please login again", 401);
};
