const {
  addProduct,
  getAllProduct,
  getSingleProduct,
  deleteProduct,
  destroyProduct,
  updateProductImages,
  updateProduct,
} = require("../controllers/productController");
const { adminProtected } = require("../middlewares/auth");

const router = require("express").Router();

router

  .post("/add-product", adminProtected, addProduct)
  .get("/", getAllProduct)
  // .get("/profile", getAllProduct)
  .get("/product/:productId", getSingleProduct)
  // .put("/update-product-image/:productId", updateProductImages)
  .put("/update-product/:productId", updateProduct)

  .delete("/delete/:productId", deleteProduct)

  .delete("/destroy", destroyProduct);

module.exports = router;
