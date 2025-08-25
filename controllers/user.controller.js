const User = require('../models/user.model.js');
const asyncHandler = require("../utilities/asyncHandler.utility.js");
const ErrorHandler = require("../utilities/errorHandler.utility.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("User already exists", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.status(201).json({
    success: true,
    token,
  });
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.status(200).json({
    success: true,
    token,
  });
});

const logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

const getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
}); 

module.exports = { registerUser, loginUser, logoutUser, getProfile };