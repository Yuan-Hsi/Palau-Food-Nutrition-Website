const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const postRouter = require("./Routes/postRoutes");
const userRouter = require("./Routes/userRoutes");
const commentRouter = require("./Routes/commentRoutes");
const appError = require("./Function/utils/appError");
const errorHandler = require("./Function/errorFunction");

const app = express();

// IMPORTANT: set what website can send the require
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // 允許前端的 localhost:3000

// middleware
app.use(helmet({
  frameguard: { action: "deny" }, // 禁止 iframe 內嵌
  contentSecurityPolicy: {
    directives: {
      frameAncestors: ["'none'"], // 禁止網站被嵌入 iframe
    },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"], // 只允許來自信任來源的 script
        objectSrc: ["'none'"], // 禁止加載 Flash 等
        upgradeInsecureRequests: [],
      },
    }
  }
})); // set security HTTP headers
app.use(morgan("dev"));
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

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
app.use("/api/v1/comment", commentRouter);

// global error handle middleware
app.all("*", (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on the server.`, 404));
});

app.use(errorHandler);

module.exports = app;
