const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("express-async-errors");
const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const blogRouter = require("./controllers/blog");
const userRouter = require("./controllers/user");
const loginRouter = require("./controllers/login");

const app = express();

mongoose.set("strictQuery", false);
logger.info(`connecting to ${config.MONGODB_URI} `);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info("connected to MongoDB"))
  .catch((error) =>
    logger.error(`error connected to MongoDB: ${error.message}`)
  );

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);
// app.use(express.static("dist"));

app.get("/", (_, response) =>
  response.send("<h1> Welcome to blog list app backend </h1>")
);
app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);

if (config.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
