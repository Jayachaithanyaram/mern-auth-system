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
const adminOnly = require(
  "../middleware/adminMiddleware"
);
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
router.get(
  "/admin",
  protect,
  adminOnly,
  (req, res) => {
    res.status(200).json({
      message: "Welcome Admin",
    });
  }
);
module.exports = router;