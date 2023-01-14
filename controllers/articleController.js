const Article = require("../models/Article");
const { createValidation } = require("../validation/articleValidation");
const User = require("../models/User");
const Notification = require("../models/Notification");
const Jimp = require("jimp");
const path = require("path");

// get all articles cotnroller
const getAllArticlesController = async (req, res) => {
  try {
    const articles = await Article.find().populate("user");

    res.status(200).json(articles);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      errro: "Server Error Occurred!!",
    });
  }
};

// get single article constroller
const getSingleArticleController = async (req, res) => {
  try {
    const { id } = req.params || {};

    if (!id) {
      return res.status(400).json({
        error: "Article ID is Required!!",
      });
    }

    const article = await Article.findById(id).populate("user");

    res.status(200).json(article);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Server Error Occurred!!",
    });
  }
};

// create new article controller
const createNewArticleController = async (req, res) => {
  try {
    const { userId, role } = req.user || {};
    const { title, description, category, coverImage } = req.body || {};

    // check user existed
    if (!userId) {
      return res.status(400).json({
        error: "User ID is Required!!",
      });
    }

    // check user role
    if (role === "user") {
      return res.status(400).json({
        error: "Your role is not comportable for create a new article!!",
      });
    }

    // check validation
    const validationError = createValidation(req.body);
    if (Object.keys(validationError).length > 0) {
      return res.status(400).json(validationError);
    }

    // upload cover image
    let imagePath = null;

    if (coverImage) {
      // upload image
      const buffer = Buffer.from(
        coverImage.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, ""),
        "base64"
      );

      imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;

      try {
        const jimpResp = await Jimp.read(buffer);
        jimpResp
          .resize(744, Jimp.AUTO)
          .write(
            path.resolve(__dirname, `../public/uploads/articles/${imagePath}`)
          );
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          error: "Could not process the image!!",
        });
      }
    }

    // create new article
    const newArticle = new Article({
      user: userId,
      title,
      description,
      category,
      publishDate: Date.now(),
      featuredImage: `/uploads/articles/${imagePath}`,
      liked: 0,
    });

    await newArticle.save();

    if (newArticle?._id) {
      // update user
      const user = await User.findById(userId).populate("followers");
      user.articles.push(newArticle?._id);
      await user.save();

      if (user?._id) {
        user?.followers.forEach(async (item) => {
          // create notification
          const newNotification = new Notification({
            title: `${user?.name} Published a new article.`,
            user: item?._id,
            article: newArticle?._id,
          });

          await newNotification.save();
        });
      }

      res.status(201).json({
        message: "Article created successfully!",
        data: newArticle,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Server Error Occurred!!",
    });
  }
};

// delete article controller
const deleteArticleController = async (req, res) => {
  try {
    const { id } = req.params || {};

    if (!id) {
      return res.status(400).json({
        error: "Article ID is Required!!",
      });
    }

    const article = await Article.findByIdAndDelete(id);

    res.status(200).json({
      message: "Article Delete Successfully.",
      article,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Server Error Occurred!",
    });
  }
};

// update article controller
const updateArticleController = async (req, res) => {
  try {
    const { id } = req.params || {};

    if (!id) {
      return res.status(500).json({
        error: "Article ID is Required!!",
      });
    }

    // check article validation
    const validationError = createValidation(req.body);
    if (Object.keys(validationError).length > 0) {
      return res.status(400).json(validationError);
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.status(201).json({
      message: "Article Update Successfull.",
      article: updatedArticle,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Server Error Occurred!!",
    });
  }
};

// article engagement controller
const articleEngagementController = async (req, res) => {
  try {
    const { articleId, type } = req.params || {};
    const { userId } = req.user || {};
    console.log(userId);

    if (!articleId) {
      return res.status(400).json({
        error: "Article ID is Required!!",
      });
    }

    if (!type) {
      return res.status(400).json({
        error: "Engagement Type is Required!!",
      });
    }

    // get article
    const article = await Article.findById(articleId);

    if (!article?._id) {
      return res.status(400).json({
        error: "Article Not Found!!",
      });
    }

    if (type === "like") {
      article.likedUsers.push(userId);
      article.liked += 1;
    } else if (type === "unlike") {
      article.likedUsers = article.likedUsers.filter(
        (item) => item.toString() !== userId
      );
      article.liked -= 1;
    }

    await article.save();

    res.status(200).json({
      message: "Engagement Update Successfully.",
      article,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Server Error Occurred!!",
    });
  }
};

module.exports = {
  getAllArticlesController,
  getSingleArticleController,
  createNewArticleController,
  deleteArticleController,
  updateArticleController,
  articleEngagementController,
};
