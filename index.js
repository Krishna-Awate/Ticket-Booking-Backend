const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
require("./database/mongoose");
const app = express();
app.use(cors());
app.use(express.json());

const { globalErrorHandler } = require("./utils/error");
const userRoutes = require("./routes/userRoutes");

app.use("/user", userRoutes);
app.use(globalErrorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Your app is running on port ${process.env.PORT}`);
});
