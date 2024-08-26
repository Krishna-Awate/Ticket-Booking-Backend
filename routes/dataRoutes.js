const express = require("express");
const router = express.Router();

const { catchAsync } = require("../utils/error");
const AppError = require("../utils/appError");
const DataModel = require("../models/dataModel");
const auth = require("../middleware/auth");

router.post(
  "/upload",
  catchAsync(async (req, res, next) => {
    console.log("req.body", req.body);
    const data = await DataModel.insertMany(req.body);
    res.status(200).json({
      status: "success",
      message: "Data added successfully",
    });
  })
);

module.exports = router;
