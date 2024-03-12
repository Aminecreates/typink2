const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

const blogController = require("../controller/blogConroller");

router
  .route("/")
  .get(blogController.getAllBlogs)
  .post(
    authController.protect,
    blogController.uploadArticleCover,
    blogController.createBlog
  );

// router
//   .route("/blogs-under-5")
//   .get(blogController.aliasBlogsUnder, blogController.getAllBlogs);
router
  .route("/:id")
  .get(blogController.getBlog)
  .patch(blogController.updateBlog)
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    blogController.deleteBlog
  );

module.exports = router;
