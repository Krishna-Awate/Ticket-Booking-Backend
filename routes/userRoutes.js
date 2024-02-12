const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { catchAsync } = require("../utils/error");
const AppError = require("../utils/appError");
const UsersModel = require("../models/usersModel");
const auth = require("../middleware/auth");
const sendMail = require("../utils/sendMail");

router.post(
  "/signup",
  catchAsync(async (req, res, next) => {
    console.log("here ", req.body);
    const { name, email, phone, password } = req.body;
    const createUser = await UsersModel.create({
      name,
      email,
      phone,
      password,
    });
    res.status(200).json({
      status: "success",
    });
  })
);

router.post(
  "/signin",
  catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    // 2) If email exist and password is correct
    const user = await UsersModel.findOne({ email });
    const correct = await user?.correctPassword(password, user.password);

    // If user is not found or password is incorrect
    if (!user || !correct) {
      return next(new AppError("Incorrect email or password", 401));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Send token in cookies
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      // secure: true,
      // httpOnly: true,
    };
    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
    res.cookie("jwt", token, cookieOptions);

    user.password = undefined;

    res.status(200).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  })
);

router.post(
  "/forgotPassword",
  catchAsync(async (req, res, next) => {
    const { email, protocol, host } = req.body;
    const user = await UsersModel.findOne({ email: email });
    if (!user) {
      return next(
        new AppError("There is no user with this email address", 404)
      );
    }
    const resetToken = await user.createPasswordResetToken();
    await user.save();
    const resetLink = `${protocol}//${host}/auth/reset-password/${resetToken}`;

    // Write email function to send
    const mailData = {
      to: user.email,
      subject: "Reset Password",
      title: "Reset your password",
      resetLink: resetLink,
      templateName: "forgotPassword",
    };
    sendMail(mailData);

    res.status(200).json({
      status: "success",
      resetToken,
    });
  })
);

router.post(
  "/resetPassword/:token",
  catchAsync(async (req, res, next) => {
    const resetToken = req.params.token;

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await UsersModel.findOne({
      password_reset_token: hashedToken,
      password_reset_expires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError("Token is invalid or expired", 400));
    }

    user.password = req.body.password;
    user.password_reset_token = undefined;
    user.password_reset_expires = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(200).json({
      status: "success",
      token,
    });
  })
);

module.exports = router;
