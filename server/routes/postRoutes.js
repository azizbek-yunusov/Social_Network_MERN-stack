const { Router } = require("express");
const router = Router();
const PostModel = require("../models/PostModel");
const loginJWTmiddleware = require("../middleware/loginJWTmiddleware");

router.get("/allpost", (req, res) => {
  PostModel.find()
    .populate("postedBy", "_id, name")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/createpost", loginJWTmiddleware, (req, res) => {
  const { title, body } = req.body;
  if ((!title, !body)) {
    return res.status(422).json({ error: "Please add all the feild" });
  }
  req.user.password = undefined;
  const post = new PostModel({
    title,
    body,
    postedBy: req.user,
  });

  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/mypost", loginJWTmiddleware, (req, res) => {
  PostModel.find({ postedBy: req.user._id })
    .populate("postedBy", "_id, name")
    .then((myPost) => {
      res.json(myPost);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
