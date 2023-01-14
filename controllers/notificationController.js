const Notification = require("../models/Notification");

// get all notification by user id controller
const getNotificationByUserIdController = async (req, res) => {
  try {
    const { id } = req.params || {};

    if (!id) {
      return res.status(400).json({
        error: "User ID is Required!!",
      });
    }

    const notifications = await Notification.find({ user: id }).populate(
      "article"
    );

    res.status(200).json(notifications);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Server Error Occurred!!",
    });
  }
};

module.exports = {
  getNotificationByUserIdController,
};
