const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const blogRouter = require("./routes/blogRoutes");
const userRouter = require("./routes/userRoutes");
const bookmarkRouter = require("./routes/bookmarkRoutes");
const viewRouter = require("./routes/viewRoutes");
const cors = require("cors");

const globalErrorHandler = require("./controller/errorController");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const AppError = require("./utilities/appError");

const app = express();

app.use(cors());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Global Middlewares
// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Set Security HTTP Headers
app.use(helmet());

// Limit requests from the same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});
app.use("/api", limiter);

// Body Parser, reading data from the body into req.body
app.use(
  express.json({
    limit: "10kb",
  })
);
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Add Content Security Policy (CSP) middleware
app.use(function (req, res, next) {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' https://cdnjs.cloudflare.com"
  );
  next();
});

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// Routes

app.use("/", viewRouter);
app.use("/api/v1/bookmarks", bookmarkRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error handling middleware
app.use(globalErrorHandler);

module.exports = app;
