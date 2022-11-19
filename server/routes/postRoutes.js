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
  const { title, body, picture } = req.body;
  if ((!title, !body)) {
    return res.status(422).json({ error: "Please add all the feild" });
  }
  req.user.password = undefined;
  const post = new PostModel({
    title,
    body,
    picture,
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
      res.json({ myPost });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/like", loginJWTmiddleware, (req, res) => {
  PostModel.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id, name")
    .populate("comments.commentBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.put("/unlike", loginJWTmiddleware, (req, res) => {
  PostModel.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id, name")
    .populate("comments.commentBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.put("/comments", loginJWTmiddleware, (req, res) => {
  const comment = {
    text: req.body.text,
    commentBy: req.user._id,
  };
  PostModel.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    { new: true }
  )
    .populate("comments.commentBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.delete("/deletepost/:postId", loginJWTmiddleware, (req, res) => {
  PostModel.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json(result);
          })
          .catch((err) => console.log(err));
      }
    });
});

router.get("/getsubspost", loginJWTmiddleware, (req, res) => {
  PostModel.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "_id name")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
