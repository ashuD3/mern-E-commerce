const { loginUser, loginEmploye, continueWithGoggle, Forgetpassword, Resetpassword } = require("../controllers/authController");
const { loginLimiter } = require("../middlewares/limiter");

const router = require("express").Router();

router
  .post("/user/login", loginLimiter, loginUser)
  .post("/user/login-with-google", loginLimiter, continueWithGoggle)
  .post("/employe/login", loginLimiter, loginEmploye)
  .post("/forgate", loginLimiter,Forgetpassword)
  .post("/reset", loginLimiter,Resetpassword)

module.exports = router;
