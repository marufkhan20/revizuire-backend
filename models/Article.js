const { Schema, model } = require("mongoose");

const articleSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    featuredImage: {
      type: String,
    },
    publishDate: Number,
    category: String,
    liked: Number,
    likedUsers: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
  },
  { timestamps: true }
);

const Article = model("Article", articleSchema);

module.exports = Article;
