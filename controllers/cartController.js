const Cart = require("../models/Cart");
const asyncHandler = require("express-async-handler");
const User = require("./../models/User");

exports.addToCart = asyncHandler(async (req, res) => {
  const { qty, productId } = req.body;

  if (!qty || !productId) {
    return res.status(400).json({
      Message: "all feild Required",
      // result,
    });
  }
  const cartItems = await Cart.findOne({ userId: req.body.userId });
  if (cartItems) {
    const index = cartItems.products.findIndex(
      (p) => p.productId.toString() === req.body.productId
    );
    console.log(index);

    if (index >= 0) {
      cartItems.products[index].qty = req.body.qty;
      // console.log(cartItems._id);
    } else {
      //push
      cartItems.products.push(req.body);
    }
    const result = await Cart.findByIdAndUpdate(cartItems._id, cartItems, {
      new: true,
    });

    console.log(result);
    return res.json({
      Message: "cart updated succesfully",
      // result,
    });
  } else {
    const cartItem = {
      userId: req.body.userId,
      products: [req.body],
    };

    const result = await Cart.create(cartItem);
    console.log(result);
    res.json({
      Message: "Product  added to cart successfully",
      result,
    });
  }
});

exports.destroyCart = asyncHandler(async (req, res) => {
  await Cart.deleteMany();
  res.json({
    message: "cart destroyed",
  });
});

exports.getCartData = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const result = await Cart.findOne({ userId: userId })
    .populate("products.productId", "name price brand image category desc")
    .select("-createdAt -updatedAt -__v -userId -_id")
    .lean();

  if (!result) {
    return res.json({
      message: "cart is empty",
      result: [],
    });
  }

  const formatedCartItems = result.products.map((p) => {
    return {
      ...p.productId,
      qty: p.qty,
    };
  });
  // console.log(formatedCartItems);

  res.json({
    Message: "Fetch from  cart successfully",
    result: formatedCartItems,
  });
});

exports.removeSingleCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { userId } = req.body;

  const result = await Cart.findOne({ userId });
  console.log(productId);
  console.log(result.products[0].productId.toString());

  const index = result.products.findIndex(
    (item) => item.productId.toString() === productId
  );
  result.products.splice(index, 1);

  const x = await Cart.findByIdAndUpdate(result._id, result, { new: true });
  console.log(x);
  res.json({
    Message: "remove successfully",
    x,
  });
});

exports.emptyCart = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  console.log(userId);
  const result = await Cart.deleteOne({ userId });
  res.json({
    message: " empty cart succesfully ",
    result,
  });
});
