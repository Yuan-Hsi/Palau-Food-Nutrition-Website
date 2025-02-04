class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // Calling Error(message) 的意思

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    this.isOperational = true; // inspect is the operantional error or programming error or somt other kinds error.

    Error.captureStackTrace(this, this.constructor); // error 發生的 log 檔 就不會顯示 AppError 現在這個 class 的這段程式
  }
}

module.exports = AppError;
