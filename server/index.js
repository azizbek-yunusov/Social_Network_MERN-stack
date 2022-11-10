const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes")
const postRoutes = require("./routes/postRoutes")

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(authRoutes)
app.use(postRoutes)

app.get("/", (req, res) => {
  res.send("Hello MERN");
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, () => {
  console.log("MongoDB is working");
});

app.listen(
  5000,
  console.log(`Server has been started on port:${PORT}`)
);
