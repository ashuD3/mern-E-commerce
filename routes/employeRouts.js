const {
  registerEmployee,
  getAllEmployee,
  getSingleEmployee,
  updateEmployee,
  deleteEmployee,
  destroyEmployee,
  admingetAllUsers,
  adminUserStatus,
  adminStat,
} = require("../controllers/employeController");
const { adminProtected } = require("../middlewares/auth");

const router = require("express").Router();

router
  .get("/", getAllEmployee)
  // .get("/profile",adminProtected,getSingleEmployee)

  .get("/users", admingetAllUsers)
  .get("/stat", adminStat)
  .put("/users/status/:userId", adminUserStatus)
  
  .get("/detail/:employeeId", getSingleEmployee)
  .put("/update/:employeeId", updateEmployee)
  .delete("/delete/:employeeId", deleteEmployee)
  .post("/register", registerEmployee)

  .delete("/destroy/:employeeId", destroyEmployee);

module.exports = router;
