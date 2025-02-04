module.exports = (err, req, res, next) => {
  // if you use (err, req, res, next) express would know it's a error handler
  err.statusCode = err.statusCode || 500; // 500 means internal server error
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
