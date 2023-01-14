const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: String,
  avatar: String,
  occupation: String,
  articles: {
    type: [Schema.Types.ObjectId],
    ref: "Article",
  },
  followers: {
    type: [Schema.Types.ObjectId],
    ref: "User",
  },
  following: {
    type: [Schema.Types.ObjectId],
    ref: "User",
  },
});

const User = model("User", userSchema);

module.exports = User;
