const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { registerValidation, loginValidation } = require("../validation");
const verify = require("../middlewares/verifytoken");
const nodemailer = require("nodemailer");

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

  // Create confirmation link that we can email the user
  const token = jwt.sign({ name: user.name }, process.env.TOKEN_SECRET);
  const link = "http://localhost:4000/user/confirm/" + token;

  // Send an email with the confirmation link
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.EMAIL_PASS, // generated ethereal password
    },
  });
  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: "Please confirm your email.",
    text: `Click this link to confirm your email: ${link}`,
  };
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log(err);
    }
    console.log("Email sent!");
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

// CONFIRM USER EMAIL
router.post("/confirm/:token", async (req, res) => {
  const token = req.params.token;
  const verified = jwt.verify(token, process.env.TOKEN_SECRET);
  const userName = verified.name;

  const user = await User.findOne({ name: userName });
  if (!user)
    return res.status(400).send("No user matching this confirmation token.");

  if (user.emailConfirmed)
    return res
      .status(400)
      .send("This user's email has already been confirmed.");

  user.emailConfirmed = true;

  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
