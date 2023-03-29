const Employee = require("./../models/Employe");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../utils/email");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

// });
exports.registerEmployee = asyncHandler(async (req, res) => {
  const { name, password, email } = req.body;
  if (!name || !password || !email) {
    return res.status(400).json({
      message: "All Felids Required",
    });
  }

  const duplicate = await Employee.findOne({ email });
  if (duplicate) {
    return res.status(400).json({
      message: "email alreday exist",
    });
  }

  const hashPass = bcrypt.hashSync(password, 10);

  const result = await Employee.create({
    ...req.body,
    // name,
    // email,
    password: hashPass,
    role: "intern",
  });
  sendEmail({
    sendTo: email,
    sub: "wellcome to SKILLHUB",
    msg: "I hope this email finds you well. I am thrilled to extend a warm welcome to you as a new member of Skillhub IT solution. We are delighted to have you on board and are looking forward to your contributions.",
  });
  res.json({
    message: "Employee Created Successfully",
  });
});

exports.getAllEmployee = asyncHandler(async (req, res) => {
  const result = await Employee.find();
  res.json({
    message: "Employee Fetched Successfully",
    result: {
      count: result.length,
      data: result,
    },
  });
});

exports.getSingleEmployee = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  const result = await Employee.findById(employeeId);
  if (!result) {
    return res.status(401).json({
      message: "Invalid User ID",
    });
  }
  res.json({
    message: "Employee Single Successfully",
    result,
  });
});

exports.updateEmployee = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  const result = await Employee.findById(employeeId);
  if (!result) {
    return res.status(401).json({
      message: "Invalid User ID",
    });
  }

  const { password, email } = req.body;
  if (password) {
    return res.status(400).json({
      message: "can not change password",
    });
  }
  if (email) {
    const dublicate = await Employee.findOne({ email });
    if (dublicate) {
      return res.status(400).json({
        message: "duplicate email",
      });
    }
  }
  await Employee.findByIdAndUpdate(employeeId, req.body);
  res.json({
    message: "Employee update Successfully",
  });
});

exports.deleteEmployee = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;

  const result = await Employee.findOne({ _id: employeeId });
  if (!result) {
    return res.status(400).json({
      message: "Invalid Id",
    });
  }
  await Employee.findByIdAndDelete(employeeId);

  res.json({
    message: "Employee delete Successfully",
  });
});

exports.destroyEmployee = asyncHandler(async (req, res) => {
  await Employee.deleteMany();

  res.json({
    message: "Employee delete Successfully",
  });
});

// exports.getSingleEmployee = asyncHandler(async (req, res) => {
// console.log(req.cookies);
//   res.json({
//     message: "Employee Single Successfully",

//   });
// });

exports.admingetAllUsers = async (req, res) => {
  try {
    const result = await User.find();
    res.json({
      message: "User Fetched Successfully",
      result,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error" + error,
    });
  }
};

exports.adminUserStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const result = await User.findByIdAndUpdate(userId, {
    active: req.body.active,
  });
  res.json({
    message: `User ${req.body.active ? "UnBlock" : "Block"} Successfully`,
  });
});

exports.adminStat = asyncHandler(async (req, res) => {
  const Users = await User.countDocuments();
  const ActiveUsers = await User.countDocuments({ active: true });
  const InActiveUsers = await User.countDocuments({ active: false });

  const Products = await Product.countDocuments();
  const PublishProducts = await Product.countDocuments({ publish: true });
  const UnPublishProducts = await Product.countDocuments({ publish: false });

  const Orders = await Order.countDocuments();
  const DeliverdOrders = await Order.countDocuments({
    orderStatus: "deliverd",
  });
  const PaidOrders = await Order.countDocuments({  paymentStatus: "Paid" });
  const codOrders = await Order.countDocuments({ paymentMode: "cod" });
  const OnlineOrders = await Order.countDocuments({ paymentMode: "online" })
  const CancelOrders = await Order.countDocuments({orderStatus: "cancel" })
  res.json({
    message: "admin stat fetch Successfully",
    result: {
      Users,
      ActiveUsers,
      InActiveUsers,

      Products,
      PublishProducts,
      UnPublishProducts,

      Orders,
      DeliverdOrders,
      PaidOrders,
      codOrders,
      OnlineOrders,
      CancelOrders
    },
  });
});
