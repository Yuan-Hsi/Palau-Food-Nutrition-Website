const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const postRouter = require("./Routes/postRoutes");
const userRouter = require("./Routes/userRoutes");
const appError = require("./Function/utils/appError");
const errorHandler = require("./Function/errorFunction");

const app = express();

// middleware
app.use(helmet()); // set security HTTP headers
app.use(morgan("dev"));
app.use(express.json());
const limiter = rateLimit({
  max: 300, // max require amount for same IP
  windowMs: 60 * 60 * 1000, // for how long
  message: "To many requests from the IP, please try again in an hour!",
});
app.use("/api", limiter);

// prevent the NoSQL injection
app.use(mongoSanitize());

// prevent XSS attack
app.use(xss());

// prevent parameter pollution, like {url}/sort=duration&sort=price => it will become an array, which might be a threat
app.use(
  hpp({
    whitelist: ["timestamp"],
  })
);

app.use("/api/v1/post", postRouter);
app.use("/api/v1/user", userRouter);

// global error handle middleware
app.all("*", (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on the server.`, 404));
});

app.use(errorHandler);

module.exports = app;
