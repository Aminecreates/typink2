const express = require("express");
const viewsController = require("../controller/viewController");
const authController = require("../controller/authController");

const router = express.Router();

router.use(authController.isLoggedIn);

router.get("/", viewsController.getOverviewTwo);
router.get("/feed", authController.protect, viewsController.getFeed); // PROTECTED ONLY LOGGEDIN USERS CAN SEE
router.get("/blogs/:slug", authController.protect, viewsController.getBlog); // PROTECTED ONLY LOGGEDIN USERS CAN SEE
router.get("/me", authController.protect, viewsController.getMe); // PROTECTED ONLY LOGGEDIN USERS CAN SEE
router.get(
  "/admin-dashboard",
  authController.protect, // Ensure protect middleware is executed first
  authController.restrictTo("admin"),
  viewsController.adminDashboard
);

router.get("/sign-up", viewsController.getSignUp);
router.get("/profile/:userId", viewsController.getUserProfile);
router.get("/write", viewsController.getWriteArticle);
router.get("/forget-password", viewsController.forgetPassword);
router.get("/reset-password/:token", viewsController.getResetPassword);

router.get("/login", viewsController.getLogin);

router.post(
  "/submit-user-data",
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
