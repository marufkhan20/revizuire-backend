const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
  try {
    const token = req.headers?.authorization;
    const decode = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );

    req.user = decode;

    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Authentication Error!!",
    });
  }
};

module.exports = {
  checkLogin,
};
