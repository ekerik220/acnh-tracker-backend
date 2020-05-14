const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { registerValidation, loginValidation } = require("../validation");

// REGISTER A USER
router.post("/register", async (req, res) => {
  // VALIDATE THE INPUT BEFORE SAVING USER
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checking if user is already in the database
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send("Email already exists");

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  // VALIDATE THE INPUT
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checking if email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email or password is wrong");

  // PASSWORD IS CORRECT
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Email or password is wrong");

  // Create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});

module.exports = router;
