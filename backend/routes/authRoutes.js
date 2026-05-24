const express = require("express");

const router = express.Router();

const {
  signupUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
  verifyEmail,
  refreshAccessToken
} = require("../controllers/authController");

const protect = require("../middleware/authMIddleware.js");
const adminOnly = require(
  "../middleware/adminMiddleware"
);
router.post("/signup", signupUser);

router.post("/login", loginUser);
router.post(
  "/refresh-token",
  refreshAccessToken
);
// Protected Route
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get(
  "/verify-email/:token",
  verifyEmail
);

//implemented full adimin route with admin middleware
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