const {
  registerValidation,
  loginValidation,
} = require("../validation/authValidation");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Jimp = require("jimp");
const path = require("path");

// create new user controller
const createNewUserController = async (req, res) => {
  try {
    console.log("Creating new user");
    // get user data from body
    const { name, email, password, role, occupation, avatar } = req.body || {};
    console.log("hello world", avatar);

    // check validation
    const validationError = registerValidation(req.body);
    if (Object.keys(validationError).length > 0) {
      return res.status(400).json(validationError);
    }

    // check user already exited
    const user = await User.findOne({ email });

    if (user?._id) {
      return res.status(400).json({
        error:
          "This email already exists! Please try another email for created account!",
      });
    }

    // generate encrypted password
    const saltRounds = 10;

    bcrypt.genSalt(saltRounds, function (err, salt) {
      console.log(err);
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) {
          console.log(err);
          return res.status(500).json({ err });
        }

        if (hash) {
          // upload avatar
          let imagePath = null;

          if (avatar) {
            // upload image
            const buffer = Buffer.from(
              avatar.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, ""),
              "base64"
            );

            imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;

            try {
              const jimpResp = await Jimp.read(buffer);
              jimpResp
                .resize(150, Jimp.AUTO)
                .write(
                  path.resolve(__dirname, `../public/uploads/user/${imagePath}`)
                );
            } catch (err) {
              console.log(err);
              return res.status(500).json({
                error: "Could not process the image!!",
              });
            }
          }

          // create new user
          const newUser = new User({
            name,
            password: hash,
            email,
            avatar: `/uploads/user/${imagePath}`,
            occupation,
            role,
          });

          await newUser.save();

          if (newUser?._id) {
            res.status(201).json({
              message: "New User Created Successfully.",
              user: newUser,
            });
          }
        }
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Server Error Occurred!!",
    });
  }
};

// login user controller
const loginUserController = async (req, res) => {
  console.log("hello world");
  try {
    // get user data
    const { email, password } = req.body || {};

    // check validation
    const validationError = loginValidation(req.body);
    if (Object.keys(validationError).length > 0) {
      return res.status(400).json(validationError);
    }

    // find user
    const user = await User.findOne({ email });

    // if user not found
    if (!user?._id) {
      return res.status(400).json({
        error: "User not found!!",
      });
    }

    // if user found
    bcrypt.compare(password, user?.password, function (err, result) {
      if (err) {
        return res.status(500).json({ error: err });
      }

      // password doest not match
      if (!result) {
        return res.status(400).json({
          error: "Email or Password Doest not match. Please try again.",
        });
      }

      // generate user object for response
      const userObject = {
        name: user.name,
        email: user.email,
        userId: user._id,
        avatar: user?.avatar,
        role: user?.role,
      };

      // generate token
      const token = jwt.sign(userObject, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
      });

      // send response
      res.status(200).json({
        token: `Bearer ${token}`,
        user: userObject,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Server Error Occurred!!",
    });
  }
};

module.exports = {
  createNewUserController,
  loginUserController,
};
