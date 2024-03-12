// bookmarkController.js
const catchAsync = require("../utilities/catchAsync");
const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const AppError = require("../utilities/appError");

exports.bookmarkBlog = catchAsync(async (req, res, next) => {
  const { blogId } = req.params;
  const userId = req.user.id;

  // Check if the blog and user exist
  const blog = await Blog.findById(blogId);
  const user = await User.findById(userId);

  if (!blog || !user) {
    return next(new AppError("Blog or user not found.", 404));
  }

  // Check if the blog is already bookmarked
  if (user.bookmarks.includes(blogId)) {
    return next(new AppError("Blog is already bookmarked.", 400));
  }

  // Add the blog to the user's bookmarks and the user to the blog's bookmarks
  user.bookmarks.push(blogId);
  blog.bookmarkedBy.push(userId);

  // Save changes to both user and blog
  await user.save({ validateBeforeSave: false });
  await blog.save({ validateBeforeSave: false });

  res.status(201).json({
    status: "success",
    message: "Blog bookmarked successfully.",
  });
});

exports.getUserBookmarks = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const user = await User.findById(userId).populate("bookmarks");

  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  const bookmarks = user.bookmarks;

  res.status(200).json({
    status: "success",
    data: {
      bookmarks,
    },
  });
});
