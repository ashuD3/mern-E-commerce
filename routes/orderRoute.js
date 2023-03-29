const {
  getUserOrder,
  userCancelOrder,
  placeOrder,
  orderPayment,
  verifyPayment,
  distroyOrders,
} = require("../controllers/orderController");
const { Protected } = require("../middlewares/auth");

const router = require("express").Router();

router

  .get("/order-history", Protected, getUserOrder)
  .put("/order-cancel/:orderId", Protected, userCancelOrder)
  .post("/order-place", Protected, placeOrder)
  .post("/payment",  orderPayment)
  .post("/payment/verify", Protected, verifyPayment)
  .delete("/distroy",  distroyOrders)



module.exports = router;
