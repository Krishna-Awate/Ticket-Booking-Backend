const mongoose = require("mongoose");

const bazarSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Name is required"],
    },
    working: {
      type: String,
    },
    code: {
      type: String,
    },
    timeFrom: {
      type: String,
    },
    timeTo: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const Data = mongoose.model("Bazar", bazarSchema, "bazar");

module.exports = Data;
