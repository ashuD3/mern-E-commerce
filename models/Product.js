const { default: mongoose } = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    image: { type: [String], required: true },
    category: {
      type: String,
      required: true,
      enum: ["cloths", "electronics", "gadgets", "footware"],
    },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: String, required: true },
    employeId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "employe",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("product", productSchema);
