const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { registerValidation, loginValidation } = require("../validation");
const verify = require("./verifytoken");

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

// ADD ITEM TO USER'S LIST
router.post("/list/add", verify, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  if (!user) return res.status(400).send("No user matching this token.");

  const matchingIndex = user.list.findIndex(
    (ele) => ele.item_name === req.body.item_name
  );

  if (matchingIndex !== -1) {
    if (!req.body.variation)
      return res.status(400).send("Item already exists.");
    if (user.list[matchingIndex].variations.includes(req.body.variation))
      return res.status(400).send("Variation already exists");
    user.list[matchingIndex].variations.push(req.body.variation);
  } else {
    user.list.push({
      item_name: req.body.item_name,
      category: req.body.category,
      variations: req.body.variation ? [req.body.variation] : [],
    });
  }
  user.save((err, doc) => {
    if (err) return res.status(400).send(err);
    else res.send(doc);
  });
});

module.exports = router;
