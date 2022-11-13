const { Router } = require("express");
const router = Router();
const bcrypt = require("bcryptjs");
const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const loginJWTmiddleware = require("../middleware/loginJWTmiddleware");

const JWT_SECRET = process.env.JWT_SECRET;

router.get("/protected", loginJWTmiddleware, (req, res) => {
  res.send("Hello user");
});

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if ((!name, !email, !password)) {
    res.status(402).json({
      error: "Please add all the feilds",
    });
  }

  UserModel.findOne({ email: email }).then((savedUser) => {
    if (savedUser) {
      return res
        .status(422)
        .json({ error: "Ushbu email bazada mavjud boshqa email kiriting" });
    }
    bcrypt.hash(password, 10).then((hashedPass) => {
      const user = new UserModel({
        name,
        email,
        password: hashedPass,
      });
      user
        .save()
        .then((user) => {
          res.json({ msg: " added successfully" });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({ error: "Please add email or password" });
  }
  UserModel.findOne({ email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid email or password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { _id, name, email } = savedUser;
          res.json({ token: token, user: { _id, name, email } });
        } else {
          return res.status(422).json({ error: "Invalid password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

//process.env.JWT_SECRET

module.exports = router;
