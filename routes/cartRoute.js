const { addToCart, getCartData, removeSingleCartItem, destroyCart, emptyCart } = require("../controllers/cartController");
;
  const { Protected } = require("../middlewares/auth");
  
  const router = require("express").Router();
  
  router
  
    
  .post("/add-to-cart", Protected, addToCart)
  .get("/cart-histroy", Protected, getCartData)
  .delete("/cart-remove-single/:productId", Protected, removeSingleCartItem)
  .delete("/cart-distroy", destroyCart)
  .delete("/empty-cart",Protected, emptyCart)
  
  module.exports = router;
  