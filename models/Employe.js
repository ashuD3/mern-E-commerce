const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    emailVerify: { type: Boolean },
    password: { type: String, required: true },
    address: { type: String },
    mobile: { type: String },
    mobileverify: { type: Boolean },
    role: {
      type: String,
      enum: ["intern", "account", "cms", "support", "admin"],
      default: "intern",
    },
    active: { type: String, default: true },
    joiningDate: { type: Date },
    dob: { type: Date },
    salary: { type: Number },
    gender: { type: Number, enum: ["male", "female", "other"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("employe", employeeSchema);
