const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { registerValidation, loginValidation } = require("../validation");
const verify = require("../middlewares/verifytoken");
const nodemailer = require("nodemailer");

// Get user info
// Expects auth-token in the header
router.get("/", verify, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });

  if (!user)
    return res
      .status(400)
      .send({ error: "Login session has expired. Please log in again." });

  res.send({
    name: user.name,
    list: user.list,
    wishlist: user.wishList,
  });
});

// REGISTER A USER
router.post("/register", async (req, res) => {
  // VALIDATE THE INPUT BEFORE SAVING USER
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  // Checking if user is already in the database
  const emailExists = await User.findOne({ email: req.body.email });
  const userExists = await User.findOne({ name: req.body.name });

  if (emailExists && userExists) {
    return res.status(400).send({
      error:
        "An account with this email already exists.<br>That user name has already been taken.",
    });
  }

  if (emailExists)
    return res
      .status(400)
      .send({ error: "An account with this email already exists." });

  if (userExists)
    return res
      .status(400)
      .send({ error: "That user name has already been taken." });

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  sendConfirmationEmail(user.email);

  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  // VALIDATE THE INPUT
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  // Checking if email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send({ error: "Email or password is wrong" });

  // Check if password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res.status(400).send({ error: "Email or password is wrong" });

  if (!user.emailConfirmed) {
    sendConfirmationEmail(user.email);
    return res.status(400).send({
      error:
        "The email for this account has not been confirmed. We'll send you a new confirmation email. If you don't see it, please check your spam folder.",
    });
  }

  // Create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send({ token: token, user: user.name });
});

// CONFIRM USER EMAIL
router.post("/confirm/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    const userEmail = verified.email;

    const user = await User.findOne({ email: userEmail });
    if (!user)
      return res
        .status(400)
        .send({ error: "No user matching this confirmation token." });

    if (user.emailConfirmed)
      return res
        .status(400)
        .send({ error: "This user's email has already been confirmed." });

    user.emailConfirmed = true;

    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send({ error: "Invalid token." });
  }
});

// RESEND CONFIRMATION EMAIL
router.post("/resend/:email", async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
  if (!user)
    return res.status(400).send({ error: "No user matching this email." });

  if (user.emailConfirmed)
    return res
      .status(400)
      .send({ error: "This user's email has already been confirmed." });

  sendConfirmationEmail(user.email);
  res.status(200).send({ message: "Resent confirmation email." });
});

const sendEmail = (to, subject, message) => {
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
    to: to,
    subject: subject,
    text: message,
  };
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log(err);
    }
    console.log("Email sent!");
  });
};

const sendConfirmationEmail = (to) => {
  // Create confirmation link that we can email the user
  const token = jwt.sign({ email: to }, process.env.TOKEN_SECRET);
  const link = "http://localhost:3000/confirm/" + token;

  const subject = "Please confirm your email.";
  const message = `Click this link to confirm your email: ${link}`;
  sendEmail(to, subject, message);
};

// FORGOT PASSWORD SEND EMAIL
router.post("/forgotpassword/:email", async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
  if (!user)
    return res.status(400).send({ error: "No user matching this email." });

  const token = jwt.sign(
    { email: req.params.email },
    process.env.TOKEN_SECRET,
    { expiresIn: "1h" }
  );

  const password_reset_link = "http://localhost:3000/passwordreset/" + token;

  const subject = "ACNH Tracker - Password reset request";
  const message = `Please click this link to begin resetting your password: ${password_reset_link}`;
  sendEmail(req.params.email, subject, message);
  res.status(200).send({ message: "Sent password reset email." });
});

// CHANGE PASSWORD
router.post("/changepassword/:token", async (req, res) => {
  const token = req.params.token;
  jwt.verify(token, process.env.TOKEN_SECRET, async function (err, decoded) {
    if (err) console.log(err);
    if (decoded) {
      const email = decoded.email;
      const newPassword = req.body.newPassword;
      const user = await User.findOne({ email: email });

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;
      const savedUser = await user.save();
      console.log(savedUser);
      res.send({ message: "Updated password." });
    }
  });
});

module.exports = router;
