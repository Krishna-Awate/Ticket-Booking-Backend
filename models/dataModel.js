const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
    },
    name: {
      type: String,
      require: [true, "Name is required"],
    },
    email: {
      type: String,
      require: [true, "Email address is required"],
    },
    phone: {
      type: Number,
      require: [true, "Phone number is required"],
    },
    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const Data = mongoose.model("Data", dataSchema, "data");

module.exports = Data;
