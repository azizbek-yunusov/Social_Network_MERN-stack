const { Router, raw } = require("express");
const router = Router();
const UserModel = require("../models/UserModel");
const loginJWTmiddleware = require("../middleware/loginJWTmiddleware");
const PostModel = require("../models/PostModel");

router.get("/user/:id", loginJWTmiddleware, (req, res) => {
  UserModel.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      PostModel.find({ postedBy: req.params.id })
        .populate("postedBy", "_id, name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "user Not Found" });
    });
});

router.put("/follow", loginJWTmiddleware, (req, res) => {
  UserModel.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      UserModel.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

router.put("/unfollow", loginJWTmiddleware, (req, res) => {
  UserModel.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      UserModel.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

module.exports = router;
