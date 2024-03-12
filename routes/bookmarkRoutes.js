// blogRoutes.js or userRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

const bookmarkController = require("../controller/bookmarkController");

// ... other routes ...

router.post(
  "/:blogId",
  authController.protect,
  bookmarkController.bookmarkBlog
);

router.get(
  "/",
  authController.protect,
  bookmarkController.getUserBookmarks
);

module.exports = router;
