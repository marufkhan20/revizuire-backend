const {
  createNewArticleController,
  getAllArticlesController,
  getSingleArticleController,
  deleteArticleController,
  updateArticleController,
  articleEngagementController,
} = require("../controllers/articleController");
const { checkLogin } = require("../middlewares/authMiddleware");

const router = require("express").Router();

// get all articles
router.get("/", getAllArticlesController);

// get single artilce
router.get("/:id", getSingleArticleController);

// create new article
router.post("/create", checkLogin, createNewArticleController);

// delete article
router.delete("/:id", deleteArticleController);

// update article
router.patch("/:id", updateArticleController);

// article like or unlike
router.patch(
  "/engagement/:articleId/:type",
  checkLogin,
  articleEngagementController
);

module.exports = router;
