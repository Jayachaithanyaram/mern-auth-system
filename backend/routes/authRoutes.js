const express = require("express");

const router = express.Router();

const {
  signupUser,
  loginUser,
  getMe,
} = require("../controllers/authController");

const protect = require("../middleware/authMIddleware.js");

router.post("/signup", signupUser);

router.post("/login", loginUser);

// Protected Route
router.get("/me", protect, getMe);

module.exports = router;