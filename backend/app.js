const express = require("express");
const morgan = require("morgan");
const postRouter = require("./Routes/postRoutes");
const userRouter = require("./Routes/userRoutes");
const appError = require("./Function/utils/appError");
const errorHandler = require("./Function/errorFunction");

const app = express();

// middleware
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1/post", postRouter);
app.use("/api/v1/user", userRouter);

// global error handle middleware
app.all("*", (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on the server.`, 404));
});

app.use(errorHandler);

module.exports = app;
