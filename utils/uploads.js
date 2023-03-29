const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const loc = "public/assets/images/product";
    if (!fs.existsSync(loc)) {
      fs.mkdirSync(loc, { recursive: true });
    }
    cb(null, loc);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const allowedExtenstion = [".png", ".jpge", ".jpg"];
    if (!allowedExtenstion.includes(ext)) {
      cb("invalid file extenstions");
    }
    const fn = uuid() + ext;
    cb(null, fn);
  },
});

exports.productUpload = multer({
  storage: productStorage,
  limits: { fileSize: "1mb" },
}).array("image", 5);