const User = require("./../models/User");
const Employe = require("./../models/Employe");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Cart = require("../models/Cart");
const { OAuth2Client } = require("google-auth-library");
const { sendEmail } = require("../utils/email");

exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).json({
      message: "All fildes required",
    });
  }

  const result = await User.findOne({ email }).lean();
  if (!result) {
    return res.status(401).json({
      message: "Email is not reagister with us",
    });
  }

  const verify = await bcrypt.compare(password, result.password);
  if (!verify) {
    return res.status(401).json({
      message: "email is not registerd with us",
    });
  }

  //   const token = jwt.sign({ id: result._id }, process.env.JWT_KEY, {
  //     expiresIn: "15m",
  //   });
  const token = jwt.sign({ id: result._id }, process.env.JWT_KEY, {
    expiresIn: "1d",
  });
  const cart = await Cart.find({ userId: result._id });

  // res.cookie("user", token, {
  //   // httpOnly: true,
  //   // secure: true,
  //   // maxAge: 1000 * 60 * 15,
  // });
  return res.json({
    message: "login success",

    result: { name: result.name, email: result.email, cart, token },
  });
});

exports.loginEmploye = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).json({
      message: "All fildes required",
    });
  }

  const result = await Employe.findOne({ email }).lean();
  if (!result) {
    return res.status(401).json({
      message: "Email is not reagister with us",
    });
  }

  const verify = await bcrypt.compare(password, result.password);
  if (!verify) {
    return res.status(401).json({
      message: "email or password wrong",
    });
  }

  //   const token = jwt.sign({ id: result._id }, process.env.JWT_KEY, {
  //     expiresIn: "15m",

  if (!result.active) {
    return res.status(401).json({
      message: "Acoount is Blocked. get in touch with admin",
    });
  }
  //   });
  const token = jwt.sign({ id: result._id }, process.env.JWT_KEY);

  res.cookie("token", token, {
    httpOnly: true,
    //secure:true
    // maxAge:1000
  });

  return res.json({
    message: "login success",
    result: {
      ...result,
      token,
    },
  });
});

exports.continueWithGoggle = asyncHandler(async (req, res) => {
  const { tokenId } = req.body;
  if (!tokenId) {
    return res.status(400).json({
      message: "Please provide Google Token",
    });
  }

  const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const {
    payload: { name, email, picture },
  } = await googleClient.verifyIdToken({
    idToken: tokenId,
  });

  const result = await User.findOne({ email }).lean();

  if (result) {
    // login

    if (!result.active) {
      return res.status(400).json({
        message: "Account by blocked by admin",
      });
    }
    const token = jwt.sign({ id: result._id }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });
    const cart = await Cart.find({ userId: result._id });
    res.json({
      message: "Login Success",
      result: {
        ...result,
        cart,
        token,
      },
    });
  } else {
    // register
    const password = await bcrypt.hash(Date.now().toString(), 10);
    const user = {
      name,
      email,
      password,
    };

    const result = await User.create(user).lean();
    const token = jwt.sign({ id: result._id }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });
    res.json({
      message: "User Register Success",
      result: {
        ...result,
        cart: [],
        token,
      },
    });
  }
});

exports.Forgetpassword = asyncHandler(async (req, res) => {
  // console.log(req.body);

  const result = await User.findOne({ email: req.body.email }).lean(); //.select("-password -__v -createdAt -updatedAt")
  if (!result) {
    return res.status(401).json({
      message: "Email is not registered with us",
    });
  }
  // console.log(email)
  if (result) {
    sendEmail({
      sendTo: req.body.email,
      sub: "Instruction for Forget Password with SKILLHUB",
      msg: `http://localhost:3000/reset/${result._id}`,
    });
  }
  res.json({
    success: true,
    message: "email send",
  });
});

exports.Resetpassword = asyncHandler(async (req, res) => {
  // console.log(req.body);
  const { password, userId } = req.body;

  const reset = await User.findById(userId).lean(); //.select("-password -__v -createdAt -updatedAt")
  if (!reset) {
    return res.status(401).json({
      message: "invalid link",
    });
  }
  const Bpassword = await bcrypt.hash(Date.now().toString(), 10);

  const result = await User.findByIdAndUpdate(userId, {
    password: Bpassword,
  });

  if (!result) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong",
    });
  }
  res.json({
    success: true,
    message: "password reset successfully",
  });
});
