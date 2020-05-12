const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Import routes
const dataRoute = require("./routes/data");
app.use("/data", dataRoute);

// CONNECT TO DB
mongoose.connect(
  process.env.DB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to the DB!");
  }
);

// MIDDLEWARES
app.use(express.json());

// START SERVER
app.listen(4000, () => console.log("Server running!"));
