const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

// Import routes
const authRoute = require("./routes/user");
const dataRoute = require("./routes/data");
const listRoute = require("./routes/list");

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
app.use(cors());
app.use("/user", authRoute);
app.use("/data", dataRoute);
app.use("/list", listRoute);

// START SERVER
app.listen(4000, () => console.log("Server running!"));
