const Product = require("./../models/Product");
const asyncHandler = require("express-async-handler");
const { productUpload } = require("../utils/uploads");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;

const path = require("path");

exports.addProduct = asyncHandler(async (req, res) => {
  // console.log(req.files)
  productUpload(req, res, async (err) => {
    const { id } = jwt.verify(req.headers.authorization, process.env.JWT_KEY);

    req.body.employeId = id;
    console.log(req.body);
    const { name, brand, category, desc, price, stock, employeId } = req.body;
    if (
      !name ||
      !brand ||
      !category ||
      !desc ||
      !price ||
      !stock ||
      !employeId
    ) {
      return res.status(400).json({
        message: "all felids require",
      });
    }
    if (err) {
      return res.status(400).json({
        message: "Multer error" + err,
      });
    }
    console.log(req.files);
    const fileName = [];
    for (let i = 0; i < req.files.length; i++) {
      // "public/assets/images/product"
      fileName.push(`assets/images/product/${req.files[i].filename}`);
    }

    const result = await Product.create({
      ...req.body,
      image: fileName,
    });
    res.json({
      message: "Product added successfully",
    });
  });
});

exports.getAllProduct = asyncHandler(async (req, res) => {
  const result = await Product.find().select(
    "-employeId -createdAt -updatedAt -__v"
  );
  res.json({
    message: "product Fetched  Succesffully",
    result: {
      data: result,
      count: result.length,
    },
  });
});

exports.getSingleProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const result = await Product.findById(productId).select(
    "-employeId -createdAt -updatedAt -__v"
  );
  if (!result) {
    return res.status(401).json({
      message: "Invalid product Id",
    });
  }
  res.json({
    message: `product with id${productId} Fetched Succesffully`,
    result,
  });
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const result = await Product.findOne({ _id: productId });

  if (!result) {
    return res.status(400).json({
      message: "Invalid  product Id",
    });
  }
  await Product.findByIdAndDelete(productId);
  res.json({
    message: "product  deleted  single Successfully",
  });
});

exports.destroyProduct = asyncHandler(async (req, res) => {
  try {
    const result = await Product.deleteMany();
    //  await fs.unlink(path.join(__dirname, "..", "public"))

    res.json({
      message: "All product deleted Succesffully",
    });
  } catch (error) {
    res.status(400).json({
      message: "error" + error,
    });
  }
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  console.log(productId);
  const singleProduct = await Product.findById(productId);
  if (!singleProduct) {
    return res.status(400).json({
      message: "Invalid Product Id",
    });
  }
  productUpload(req, res, async (err) => {
    console.log("------------");
    console.log(req.files);
    console.log("------------");

    if (err) {
      return res.status(400).json({
        message: "Multer Error " + err,
      });
    }
    let fileNames = [];

    for (let i = 0; i < req.files.length; i++) {
      fileNames.push(`assets/images/product/${req.files[i].filename}`);
    }

    if (fileNames.length > 0) {
      for (let i = 0; i < singleProduct.image.length; i++) {
        await fs.unlink(
          path.join(__dirname, "..", "public", singleProduct.image[i])
        );
      }
    } else {
      fileNames = singleProduct.image;
    }

    const result = await Product.findByIdAndUpdate(
      productId,
      { ...req.body, image: fileNames },
      { new: true }
    );

    res.json({ message: "product image update successfully", result });
  });
});

// exports.updateProductImages = asyncHandler(async (req, res) => {
//   const { productId } = req.params;
//   const singleProduct = await Product.findById(productId);
//   if (!singleProduct) {
//     return res.status(400).json({
//       message: "Invalid product  Id",
//     });
//   }

//   // console.log(result.image);

//   productUpload(req, res, async (err) => {
//     if (err) {
//       res.status(400).json({
//         message: " multer error" + err,
//       });
//     }
//     for (let i = 0; i < singleProduct.image.length; i++) {
//       await fs.unlink(
//         path.join(__dirname, "..", "public", singleProduct.image[i])
//       );
//     }
//     // singleProduct.image.forEach((item) => {
//     //   fs.unlinkSync(path.join(__dirname, "..", "public", item));
//     // });
//     const fileName = [];
//     for (let i = 0; i < req.files.length; i++) {
//       // "public/assets/images/product"
//       fileName.push(`assets/images/product/${req.files[i].filename}`);
//     }

//     const result = await Product.findByIdAndUpdate(productId, {
//       image: fileName,
//     });
//   });

//   res.json({
//     message: "ok",
//   });
// });
exports.updateProductImages = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const singleProduct = await Product.findById(productId);
  if (!singleProduct) {
    return res.status(400).json({
      message: "Invalid Product Id",
    });
  }

  productUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        message: "Multer Error " + err,
      });
    }
    for (let i = 0; i < singleProduct.image.length; i++) {
      await fs.unlink(
        path.join(__dirname, "..", "public", singleProduct.image[i])
      );
    }

    const fileNames = [];
    for (let i = 0; i < req.files.length; i++) {
      fileNames.push(`assets/images/products/${req.files[i].filename}`);
    }
    const result = await Product.findByIdAndUpdate(
      productId,
      {
        image: fileNames,
      },
      { new: true }
    );

    res.json({ message: "ok" });
  });
});
