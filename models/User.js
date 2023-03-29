const { default: mongoose } = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    email_verify: {
      type: String,
    },

    mobile: {
      type: String,
    },
    mobile_verify: {
      type: Boolean,
    },
    password: {
      type: String,
      required: true,
    },
    // Cpassword: {
    //   type: String,
    //   required: true,
    // },
    house: {
      type: String,
    },
    landmark: {
      type: String,
    },
    pincode: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("user", userSchema);
