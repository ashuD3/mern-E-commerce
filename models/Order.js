const { default: mongoose } = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "product",
          required: true,
        },
       
        qty: {
          type: Number,
          required: true,
        },
      },
    ],
    delivered: {
      type: Boolean,
      default: false,
    },
    paymentMode: {
      type: String,
      enum: ["cod", "online"],
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: ["placed", "dispatch", "out", "deliverd", "cancel", "return"],
      default: "placed",
    },
    PaymentId: String,
    orderId:String,
    paymentSignature:String,

  },
  { timestamps: true }
);
module.exports = mongoose.model("order", orderSchema);
