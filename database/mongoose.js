const mongoose = require("mongoose");

console.log("server", process.env.SERVER);
mongoose
  .connect(process.env.SERVER, {})
  .then(() => {
    console.log("connection to database successfull");
  })
  .catch((e) => {
    console.log("Not connected", e);
  });
