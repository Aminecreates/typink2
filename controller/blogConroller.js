const { Query } = require("mongoose");
const multer = require("multer");

const Blog = require("../models/blogModel");
const { json } = require("express");
const APIFeatures = require("../utilities/apiFeatures");
const catchAsync = require("../utilities/catchAsync");
const AppError = require("../utilities/appError");
const User = require("../models/userModel");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/imgs/article-images");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `cover-${req.user.id}-${Date.now()}.${ext}`);
  },
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadArticleCover = upload.single("imageCover");

// Function to retrieve all blogs
exports.getAllBlogs = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const featuers = new APIFeatures(Blog.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const blogs = await featuers.query;

  // SEND RESULT
  res.status(200).json({
    status: "success",
    result: blogs.length,
    data: {
      blogs,
    },
  });
});
// exports.aliasBlogsUnder = (req, res, next) => {
//   req.query.limit = "3";
//   req.query.sort = "minutesRead";
//   req.query.fields = "title,genre,author,minutesRead";

//   next();
// };
exports.getBlog = catchAsync(async (req, res, next) => {
  // Retrieve one blog based on id
  // console.log(req.params);
  const blog = await Blog.findById(req.params.id).populate("author");

  if (!blog) {
    return next(new AppError("No blog found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      blog,
    },
  });
});

exports.updateBlog = catchAsync(async (req, res, next) => {
  // Retrieve one blog based on id
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!blog) {
    return next(new AppError("No blog found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      blog,
    },
  });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
  // Retrieve one blog based on id
  const blog = await Blog.findByIdAndDelete(req.params.id);

  if (!blog) {
    return next(new AppError("No blog found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Function to create a new blog
// Function to create a new blog
exports.createBlog = catchAsync(async (req, res, next) => {
  // Set the imageCover field to the filename provided by Multer
  req.body.imageCover = req.file.filename;
  console.log(req.body.imageCover);

  // Set the author field to the current user's _id
  req.body.author = req.user._id;

  // Create the new blog with the updated req.body
  const newBlog = await Blog.create(req.body);

  // Push the new blog's _id to the blogs array of the user
  await User.findByIdAndUpdate(
    req.user.id, // User's _id
    { $push: { blogs: newBlog.id } }, // Push the new blog's _id to the blogs array
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      blog: newBlog,
    },
  });
});
