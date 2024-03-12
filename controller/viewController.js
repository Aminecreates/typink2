const catchAsync = require("../utilities/catchAsync");
const Blog = require("../models/blogModel");
const formatDate = require("../utilities/formatDate");
const AppError = require("../utilities/appError");
const User = require("../models/userModel");

exports.getOverviewTwo = catchAsync(async (req, res, next) => {
  const latestBlog = await Blog.findOne().sort({ createdAt: -1 });

  if (!latestBlog) {
    return res.status(404).render("error", { message: "No blogs found." });
  }

  const latest3Blogs = await Blog.find()
    .sort({ createdAt: -1 })
    .limit(3)
    .populate("author"); // Limit the results to the three latest blogs

  if (!latest3Blogs.length) {
    return res.status(404).render("error", { message: "No blogs found." });
  }
  const allBlogs = await Blog.find().sort({ createdAt: -1 }).populate("author"); // Limit the results to the three latest blogs

  if (!allBlogs.length) {
    return res.status(404).render("error", { message: "No blogs found." });
  }

  const topics = [...new Set(allBlogs.map((blog) => blog.topic))];

  res.status(200).render("overviewTwo", {
    title: "Typink - Account",
    latestBlog,
    allBlogs,
    latest3Blogs,
    formatDate,
    topics, // Pass the unique topics to the view
  });
});

exports.getFeed = catchAsync(async (req, res, next) => {
  if (!res.locals.user) {
    // If user is already logged in, redirect to the feed page
    return res.redirect("/login");
  }
  const latestBlog = await Blog.findOne().sort({ createdAt: -1 });
  console.log(req.user);

  if (!latestBlog) {
    return res.status(404).render("error", { message: "No blogs found." });
  }

  const latest3Blogs = await Blog.find()
    .sort({ createdAt: -1 })
    .limit(2)
    .populate("author"); // Limit the results to the three latest blogs

  if (!latest3Blogs.length) {
    return res.status(404).render("error", { message: "No blogs found." });
  }
  const allBlogs = await Blog.find().sort({ createdAt: -1 }).populate("author"); // Limit the results to the three latest blogs

  if (!allBlogs.length) {
    return res.status(404).render("error", { message: "No blogs found." });
  }
  const topics = [...new Set(allBlogs.map((blog) => blog.topic))];

  res.status(200).render("feed", {
    title: "Typink - Account",
    latestBlog,
    allBlogs,
    latest3Blogs,
    topics, // Pass the unique topics to the view

    formatDate,
  });
});

exports.getBlog = catchAsync(async (req, res, next) => {
  if (!res.locals.user) {
    // If user is already logged in, redirect to the feed page
    return res.redirect("/login");
  }
  // get the data for requested tour
  const blog = await Blog.findOne({ slug: req.params.slug }).populate("author");
  // console.log(blog);
  if (!blog) {
    return next(new AppError("There is no blog with that title", 404));
  }
  res.status(200).render("article-page", {
    title: "Typink - Blog",
    formatDate,
    blog,
  });
});

exports.getLogin = catchAsync(async (req, res, next) => {
  // Check if user is logged in
  if (res.locals.user) {
    // If user is already logged in, redirect to the feed page
    return res.redirect("/feed");
  }

  // If user is not logged in, render the login page
  res.status(200).render("login", {
    title: "Typink - Login",
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  console.log(res.locals.user);
  if (!res.locals.user) {
    // If user is already logged in, redirect to the feed page
    return res.redirect("/login");
  }
  res.status(200).render("userAccount", {
    title: "Typink - Account",
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  console.log("UPDATING USER", req.body);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render("userAccount", {
    title: "Typink - Account",
    user: updatedUser,
  });
});

exports.adminDashboard = catchAsync(async (req, res, next) => {
  const users = await User.find({ role: { $ne: "admin" } }); // Filter out admin users
  const blogs = await Blog.find().populate("author");
  // Render the admin dashboard template without passing any data
  res.status(200).render("admin-dashboard", {
    title: "Typink - Admin Dashboard",

    users,
    blogs,
    formatDate,
  });
});

exports.getSignUp = catchAsync(async (req, res, next) => {
  if (res.locals.user) {
    // If user is already logged in, redirect to the feed page
    return res.redirect("/feed");
  }
  res.status(200).render("sign-up", {
    title: "Typink - Admin Dashboard",
  });
});

// controllers/viewsController.js

exports.getUserProfile = catchAsync(async (req, res, next) => {
  // Get the user ID from the request parameters
  console.log(res.locals.user);
  const userId = req.params.userId;

  // Fetch the user data from the database
  const userProfileInfo = await User.findById(userId);

  if (!userProfileInfo) {
    // If user is not found, return a 404 error
    return res.status(404).send("User not found");
  }

  // Fetch the currently logged-in user information
  const loggedInUser = res.locals.user._id;

  const blogs = await Blog.find({ author: userId });

  // Render the profile view and pass the user data and loggedInUser to it
  res.status(200).render("profile", {
    title: "Typink - My profile",
    userProfileInfo: userProfileInfo,
    blogs,
    loggedInUser: loggedInUser, // Pass the loggedInUser information
  });
});

exports.getWriteArticle = catchAsync(async (req, res, next) => {
  // Get the user ID from the request parameters

  // Render the profile view and pass the user data to it
  res.status(200).render("write-article", {
    title: "Typink - Write article",
  });
});
exports.forgetPassword = catchAsync(async (req, res, next) => {
  res.status(200).render("forget-password", {
    title: "Typink - Forget password",
  });
});
// viewsController.js

exports.getResetPassword = (req, res) => {
  if (res.locals.user) {
    // If user is already logged in, redirect to the feed page
    return res.redirect("/feed");
  }
  res.render("reset-password", {
    title: "Reset Password",
    token: req.params.token,
  });
};
