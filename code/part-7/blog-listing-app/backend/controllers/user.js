const bcrypt = require("bcrypt");
const userRouter = require("express").Router();
const User = require("../models/user");

userRouter.post("/", async (request, response) => {
  const payload = request.body;
  if (
    !payload.password ||
    payload.password.trim().length === 0 ||
    payload.password.length < 8
  ) {
    response.status(400).send({ error: "password is invalid" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(payload.password, saltRounds);

  const user = new User({
    name: payload.name,
    username: payload.username,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

userRouter.get("/", async (_, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });
  response.json(users);
});

module.exports = userRouter;
