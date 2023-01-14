const {
  getNotificationByUserIdController,
} = require("../controllers/notificationController");
const { checkLogin } = require("../middlewares/authMiddleware");

const router = require("express").Router();

// get all notification by user id
router.get("/get-all/:id", checkLogin, getNotificationByUserIdController);

module.exports = router;
