const Product = require("./../models/Product");
const User = require("./../models/User");
const Order = require("./../models/Order");
const asyncHandler = require("express-async-handler");
const Cart = require("../models/Cart");
const Razorpay = require("razorpay");
const { v4: uuid } = require("uuid");
const crypto = require("crypto");
const { sendEmail } = require("../utils/email");
const { orderRecipt } = require("../utils/emailTemplates");
const { format } = require("date-fns");

exports.placeOrder = asyncHandler(async (req, res) => {
  const { userId, type } = req.body;
  if (!type) {
    return res.status(400).json({
      message: "{Please Provide Type",
    });
  }

  let productArray;
  if (type === "buynow") {
    productArray = [
      {
        productId: req.body.productId,
        qty: req.body.qty,
      },
    ];
  } else {
    const cartItem = await Cart.findOne({ userId });
    await Cart.deleteOne({ userId });
    productArray = cartItem.products;
  }
  const result = await Order.create({
    userId,
    products: productArray,
    paymentMode: "cod",
  });
  // console.log(cartItem);

  res.json({
    message: "order Placed Successfully",
    result,
  });
});

exports.getUserOrder = asyncHandler(async (req, res) => {
  console.log(req.body);
  const result = await Order
  .find({ userId: req.body.userId })

    .populate("products.productId")
    // .populate({
    //   path: "products",
    //   populate: {
    //     path: "productId",
    //     model: "product",
    //   },
    // })
    .select("-createdAt -updatedAt -__v");

  console.log(result);
  res.json({
    message: "user order fetched Successfully",
    count: result.length,
    result,
  });
});

exports.userCancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const result = await Order.findByIdAndUpdate(orderId, {
    orderStatus: "cancel",
  });
  res.json({
    message: "order cancel Successfully",
    result,
  });
});

exports.orderPayment = asyncHandler(async (req, res) => {
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
  });
  instance.orders.create(
    {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: uuid(),
    },
    (err, order) => {
      if (err) {
        return res.status(400).json({
          message: "Order Fail" + err,
        });
      }
      res.json({
        message: "payment Initiated",
        order,
      });
    }
  );
});

exports.verifyPayment = asyncHandler(async (req, res) => {
  console.log("*****");
  console.log(req.body);
  console.log("*****");
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const key = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", `${process.env.RAZORPAY_SECRET}`)
    .update(key.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({
      message: `Invalid Payment, Signature mismatch`,
    });
  }

  console.log("after verify");
  const { userId, type } = req.body;

  const user = await User.findOne({ _id: userId });

  let cartItem, result, total, formatedCartItems, productDetails;
  if (type === "cart") {
    cartItem = await Cart.findOne({ userId });

    productDetails = await Cart.findOne({ userId: userId })
      .populate("products.productId", "name price brand image category desc")
      .select("-createdAt -updatedAt -__v -userId -_id")
      .lean();

    formatedCartItems = productDetails.products.map((p) => {
      return {
        ...p.productId,
        qty: p.qty,
      };
    });
    // console.log("-----------------------");
    // console.log(formatedCartItems);
    // console.log("-----------------------");

    total = formatedCartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

    await Cart.deleteOne({ userId });
  } else if (type === "buynow") {
    cartItem = {
      products: [
        {
          productId: req.body.productId,
          qty: req.body.qty,
        },
      ],
    };
    const p = await Product.findOne({ _id: req.body.productId });
    total = p.price * req.body.qty;
    formatedCartItems = [
      {
        name: p.name,
        price: p.price,
        qty: req.body.qty,
      },
    ];
  }

  result = await Order.create({
    PaymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
    paymentSignature: razorpay_signature,
    userId,
    products: cartItem.products,
    paymentMode: "online",
    paymentStatus: "paid",
  });

  sendEmail({
    sendTo: user.email,
    sub: "Order Placed Succesfully",
    htmlMsg: orderRecipt({
      userName: user.name,
      date: format(Date.now(), "dd-MM-yyyy"),
      orderId: result._id,
      products: formatedCartItems,
      total,
    }),
    msg: `thank you for order \n
    orderId :${result._id}\n
    payment status  : paid \n
    payment mode : online \n
    payment Id :${result.PaymentId}\n`,
  });

  //if cart

  res.json({
    message: "payment success",
  });
});

exports.distroyOrders = asyncHandler(async (req, res) => {
  const result = await Order.deleteMany();

  res.json({
    message: "all order distroy",
  });
});
