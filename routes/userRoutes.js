const router = require("express").Router();
const {
  getAllUsersController,
  followUserController,
} = require("../controllers/userController");
const { checkLogin } = require("../middlewares/authMiddleware");

// get all users
router.get("/", checkLogin, getAllUsersController);

// follow user
router.patch("/following/:followingId/:type", checkLogin, followUserController);

module.exports = router;
