const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

// Register Account

router.post("/", async (req, res) => {
  try {
    let { email, password, passwordVerify, fName, lName } = req.body;

    email = email.trim();
    password = password.trim();
    passwordVerify = passwordVerify.trim();
    fName = fName.trim();
    lName = lName.trim();

    // validation
    if (!email || !password || !passwordVerify || !fName || !lName) {
      return res
        .status(400)
        .json({ errormessage: "Please enter all required fields" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        errormessage: "Please enter a valid email address",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        errormessage: "Please enter password of atleast 6 characters",
      });
    }
    if (passwordVerify !== password) {
      return res
        .status(400)
        .json({ errormessage: "Please enter same password twice" });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        errormessage: "An account with the same email already exists",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // save user to database
    const user = new User({ email, passwordHash, fName, lName });
    const saveUser = user.save();

    //sign token
    const token = jwt.sign(
      {
        user: saveUser._id,
      },
      process.env.JWT_SECRET
    );

    // send the token
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

// Login Account

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.trim();
    password = password.trim();

    // validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ errormessage: "Please enter all required fields" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        errormessage: "Please enter a valid email address",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        errormessage: "Please enter password of atleast 6 characters",
      });
    }
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(401).json({
        errormessage: "Wrong email address or password",
      });
    }

    const correctPassword = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );
    if (!correctPassword) {
      return res.status(401).json({
        errormessage: "Wrong email address or password",
      });
    }

    //sign token
    const token = jwt.sign(
      {
        user: existingUser._id,
      },
      process.env.JWT_SECRET
    );

    // send the token
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

// log users out

router.get("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) }).send();
});

router.get("/loggedin", (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.json(false);
    }
    jwt.verify(token, process.env.JWT_SECRET);
    res.json(true);
  } catch (err) {
    res.json(false);
  }
});

module.exports = router;
