const express = require("express");
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const {
  authRoutes,
  articleRoutes,
  userRoutes,
  notificcationRoutes,
} = require("./routes");

const app = express();

const corsOptions = {
  origin: "https://revizuire.com",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors(corsOptions));

// public folder
const publicDirectoryPath = path.join(__dirname, "/public");
app.use(express.static(publicDirectoryPath));

// app routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/notifications", notificcationRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to our newspaper Application.",
  });
});

// database connection
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("database connection successful!"))
  .catch((err) => console.log("error", err));

// server listeing
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SERVER LISTENING ON PORT ${PORT}`);
});
