const express = require("express");
const app = express();
const cors = require('cors')
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes")
const postRoutes = require("./routes/postRoutes")
const userRoutes = require("./routes/userRoutes")

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.get("/", (req, res) => {
  res.send("Hello MERN");
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, () => {
  console.log("MongoDB is working");
});
app.use(authRoutes)
app.use(postRoutes)
app.use(userRoutes)

app.listen(
  5000,
  console.log(`Server has been started on port:${PORT}`)
);
