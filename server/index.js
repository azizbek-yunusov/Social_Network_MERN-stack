const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes")

app.use(express.json())
// app.use(express.urlencoded({extended: true}))
app.use(authRoutes)

app.get("/", (req, res) => {
  res.send("Hello MERN");
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, () => {
  console.log("MongoDB ok");
});

app.listen(
  5000,
  console.log(`Server listening on port: ${PORT} http://localhost:${PORT}`)
);
