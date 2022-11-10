const { Schema, model } = require("mongoose")

const postSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: true,
    default: "Not Photo"
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
})

module.exports = model("Post", postSchema);