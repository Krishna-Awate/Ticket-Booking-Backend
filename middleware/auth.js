const jwt = require("jsonwebtoken");
const { catchAsync } = require("../utils/error");
const AppError = require("../utils/appError");
const UsersModel = require("../models/usersModel");

const auth = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authoriztion &&
    req.headers.authoriztion.startsWith("Bearer")
  ) {
    token = req.headers.authoriztion.split(" ")[1];
  }

  // token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YmVmZTRiODhjNGJjZmE5NzhiZDkzYyIsImlhdCI6MTcwNzAxOTQwNH0.t1xrVV0xTc2t-OawttJB-tfB8M-jhCmAM-Ulv7QJQZg";

  if (!token) {
    new AppError("You are not logged in! Please log in to get access.", 401);
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await UsersModel.findById(decoded.id);
  if (!currentUser) {
    new AppError("User does not exist", 404);
  }
  req.user = currentUser;
  next();
});

module.exports = auth;
