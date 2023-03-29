const express = require("express");
require("dotenv").config({ path: "./.env" });
const { format } = require("date-fns");
const cors = require("cors");
const connectDB = require("./config/db");
const { log, logEvent } = require("./middlewares/logger");
const app = express();
const mongoose = require("mongoose");
const { errorHandler } = require("./middlewares/error");
const path = require("path");
const cookieParser = require("cookie-parser");
connectDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(log);
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: (o, cb) => {
      const allowed = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:3000",
      ];
      if (allowed.indexOf(o) !== -1 || !o) {
        cb(null, true);
      } else {
        cb("blocked by cors");
      }
    },
  })
);
app.use("/user", require("./routes/userRouts"));
app.use("/order", require("./routes/orderRoute"));
app.use("/cart", require("./routes/cartRoute"));

app.use("/employe",require("./routes/employeRouts"));
app.use("/auth", require("./routes/authRoute"));
app.use("/products", require("./routes/productRoutes"));

app.use("*", (req, res) => {
  res.status(404).json({
    message: "404:Resource You Are Looking For Is Not Avaliable",
  });
});

app.use(errorHandler);
const PORT = process.env.PORT || 5000;
mongoose.connection.once("open", () => {
  app.listen(PORT, console.log(`SURVER RUNNING http://localhost:${PORT}`));
  console.log("Mongo Connected");
});
mongoose.connection.on("error", (err) => {
  const msg = `${format(new Date(), "dd-MM-yyyy\t HH:mm:ss")}\t${err.code}\t${
    err.name
  }`;
  logEvent({
    fileName: "mongo.log",
    message: msg,
  });
});
