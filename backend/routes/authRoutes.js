const express = require("express");

const router = express.Router();

const {
  signupUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
  verifyEmail,
} = require("../controllers/authController");

const protect = require("../middleware/authMIddleware.js");

router.post("/signup", signupUser);

router.post("/login", loginUser);

// Protected Route
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get(
  "/verify-email/:token",
  verifyEmail
);

module.exports = router;