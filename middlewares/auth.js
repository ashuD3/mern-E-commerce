const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Employee = require("./../models/Employe");
const User = require("../models/User");

exports.adminProtected = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization;
  // const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({
      message: "please provide token",
    });
  }

  const { id } = jwt.verify(token, process.env.JWT_KEY);
  const result = await Employee.findById(id);
  if (!result) {
    return res.status(401).json({
      message: "can not find this user",
    });
  }
  if (result.role !== "admin") {
    return res.status(401).json({
      message: "Admin only Route, Please get in touch with admin",
    });
  }

  req.body.employeId = id;
  next();
});

exports.Protected = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization;
  console.log("xxxx", req.cookies);

  if (!token) {
    return res.status(400).json({
      message: "please provide token",
    });
  }

  // const[, tk ]= token.split(" ")
  const tk = token.split(" ")[1];

  const { id } = jwt.verify(tk, process.env.JWT_KEY);
  if (!id) {
    return res.status(401).json({
      message: "INVALID Token",
    });
  }

  const result = await User.findById(id);
  if (!result.active) {
    return res.status(401).json({
      message: "account is blocked by admin .get in touch with admin",
    });
  }

  req.body.userId = id;
  next();
});
