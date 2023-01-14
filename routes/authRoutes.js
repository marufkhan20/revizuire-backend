const {
  createNewUserController,
  loginUserController,
} = require("../controllers/authController");

const router = require("express").Router();

router.post("/register", createNewUserController);

router.post("/login", loginUserController);

module.exports = router;
