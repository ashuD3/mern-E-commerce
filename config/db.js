const mongoose = require("mongoose");

const connectDB = () => {
  try {
    mongoose.set("strictQuery", true);
    mongoose.connect(process.env.MONGO_URL);
    console.log("MONGO CONNECTED");
  } catch (error) {
    console.log("MONGO ERROR" + error);
  }
};

module.exports = connectDB;
