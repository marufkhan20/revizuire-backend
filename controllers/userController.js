const User = require("../models/User");

// get all users controller
const getAllUsersController = async (req, res) => {
  try {
    const { role } = req.user || {};

    if (role !== "admin") {
      return res.status(400).json({
        error: "All Users See only Admin.",
      });
    }

    const allUsers = await User.find();
    res.status(200).json({ users: allUsers });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Server Error Occurred!!",
    });
  }
};

// follow user controller
const followUserController = async (req, res) => {
  try {
    const { followingId, type } = req.params || {};
    const { userId } = req.user || {};

    if (!followingId) {
      return res.status(400).json({
        error: "Following User ID is Required!!",
      });
    }

    if (!type) {
      return res.status(400).json({
        error: "Type is Required!!",
      });
    }

    // get following user
    const followingUser = await User.findById(followingId);

    if (!followingUser?._id) {
      return res.status(400).json({
        error: "Following User not Found!!",
      });
    }

    // get current login user
    const currentUser = await User.findById(userId);

    if (!currentUser?._id) {
      return res.status(400).json({
        error: "Current User Not Found!!",
      });
    }

    if (type === "follow") {
      followingUser.followers.push(currentUser?._id);
      currentUser.following.push(followingUser?._id);
    } else if (type === "unfollow") {
      followingUser.followers = followingUser.followers.filter(
        (item) => item.toString() !== currentUser?._id.toString()
      );

      currentUser.following = currentUser.following.filter(
        (item) => item.toString() !== followingUser?._id.toString()
      );
    }

    await followingUser.save();

    await currentUser.save();

    res.status(200).json({
      message: `${type === "follow" ? "Following" : "Un Following"} ${
        followingUser?.name
      } is successfull`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Server Error Occurred!!",
    });
  }
};

module.exports = {
  getAllUsersController,
  followUserController,
};
