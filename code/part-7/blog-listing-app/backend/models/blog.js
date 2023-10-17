const mongoose = require("mongoose");
const constants = require("../utils/constants");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  author: {
    type: String,
    required: [true, "Author is required"],
  },
  url: {
    type: String,
    required: [true, "Url is required"],
    validate: {
      validator: function (v) {
        return constants.URL_REGEX.test(v);
      },
    },
  },
  likes: {
    type: Number,
    min: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "userID is required"],
  },
});

blogSchema.set("toJSON", {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Blog", blogSchema);
