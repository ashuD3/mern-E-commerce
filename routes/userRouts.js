const {
  getAllUsers,
  registerUsers,
  editUsers,

  getSingleUsers,
  destroyUsers,
  deleteUsers,
  getUserProfile,
} = require("../controllers/userController");
const { Protected } = require("../middlewares/auth");

const router = require("express").Router();
router
  .get("/", getAllUsers)
  .get("/profile", Protected,getUserProfile)
  
  .post("/register", registerUsers)
  .put("/profile-update",Protected, editUsers)


  .delete("/delete/:id", deleteUsers)
  .delete("/distroy", destroyUsers)
  .get("/:id", getSingleUsers)

module.exports = router;
