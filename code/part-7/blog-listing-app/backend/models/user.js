const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const constants = require("../utils/constants");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    minLength: 3,
    validate: {
      validator: function (v) {
        return constants.USERNAME_RGEX.test(v);
      },
      message: (props) => `${props.value} is not a valid username!`,
    },
    unique: true,
  },
  name: { type: String, required: [true, "name is required"], minLength: 4 },
  passwordHash: {
    type: String,
    required: [true, "passwordHash is required"],
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

userSchema.set("toJSON", {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
