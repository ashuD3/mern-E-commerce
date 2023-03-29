const User = require("./../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/email");

exports.registerUsers = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new Error("All fileds required");
    }

    const found = await User.findOne({ email });

    if (found) {
      throw new Error("Email Already Exist");
    }

    const hashPass = await bcrypt.hash(password, 10);
    // console.log(req.body);

    const result = await User.create({ name, email, password: hashPass });
    const token = jwt.sign({ id: result._id }, process.env.JWT_KEY);
    sendEmail({
      sendTo: email,
      sub: "wellcome to MERN Ecommerce",
      msg: "Hello and welcome to our website! We're thrilled to have you here. Please feel free to explore and discover all that we have to offer. If you have any questions or need assistance, don't hesitate to reach out. Thank you for registring with us!",
    });
    res.json({
      message: "User Register Succesffully",
      result: {
        id: result._id,
        name,
        token,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: "error" + error,
    });
  }
};

exports.editUsers = async (req, res) => {
  try {
    const { id } = req.params;
    // if (!id) {
    //   throw new Error("can not change email")

    // }
    const result = await User.findByIdAndUpdate(id, req.body.userId, req.body);
    res.json({
      // success: true,
      message: "User Updated Succesffully",
    });
  } catch (error) {
    res.status(400).json({
      message: "error" + error,
    });
  }
};

exports.deleteUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await User.findByIdAndDelete(id, req.body);
    res.json({
      message: "User Deleted Succesffully",
    });
  } catch (error) {
    res.status(400).json({
      message: "error" + error,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const result = await User.find();
    res.json({
      message: "User Fetched  Succesffully",
      result,
    });
  } catch (error) {
    res.status(400).json({
      message: "error" + error,
    });
  }
};

exports.getSingleUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await User.findOne({ _id: id });
    if (!result) {
      throw new Error("User Not Found");
    }
    res.json({
      message: "User single Fetched Succesffully",
      result,
    });
  } catch (error) {
    res.status(400).json({
      message: "error" + error,
    });
  }
};

exports.destroyUsers = async (req, res) => {
  try {
    await User.deleteMany();
    res.json({
      message: "   All User deleted Succesffully",
    });
  } catch (error) {
    res.status(400).json({
      message: "error" + error,
    });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    // console.log(req.body.userId);
    const result = await User.findOne({ _id: req.body.userId }).select(
      "-_id -__v   -createdAt -updatedAt"
    );
    // console.log(result);
    if (!result) {
      throw new Error("User Not Found");
    }
    res.json({
      message: "User Profile Fetched Succesffully",
      result: {
        name: result.name,
        email: result.email,
        mobile: result.mobile || "",
        house: result.house || "",
        pincode: result.pincode || "",
        state: result.state || "",
        landmark: result.landmark || "",
        city: result.city || "",
      },
    });
  } catch (error) {
    res.status(400).json({
      message: "error" + error,
    });
  }
};
