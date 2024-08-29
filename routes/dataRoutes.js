const express = require("express");
const router = express.Router();

const { catchAsync } = require("../utils/error");
const AppError = require("../utils/appError");
const DataModel = require("../models/dataModel");
const BazarModel = require("../models/bazarModel");
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

router.get(
  "/bazar",
  catchAsync(async (req, res, next) => {
    const dayBazarPromise = BazarModel.find({ type: "day" });
    const nightBazarPromise = BazarModel.find({ type: "night" });

    const [dayBazar, nightBazar] = await Promise.all([
      dayBazarPromise,
      nightBazarPromise,
    ]);

    res.status(200).json({
      status: "success",
      data: {
        day: dayBazar,
        night: nightBazar,
      },
    });
  })
);

router.post(
  "/bazar",
  catchAsync(async (req, res, next) => {
    console.log("req.body", req.body);
    const data = await BazarModel.create(req.body);
    res.status(200).json({
      status: "success",
      message: "Data added successfully",
    });
  })
);

module.exports = router;
