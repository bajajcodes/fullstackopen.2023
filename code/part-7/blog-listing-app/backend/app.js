const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const config = require("./utils/config");
const middleware = require("./utils/middleware");
const phonebookRouter = require("./controllers/phonebook");
const app = express();

mongoose.set("strictQuery", false);

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.info("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
app.use(morgan(":body :method :url "));
app.use(express.static("dist"));

morgan.token("body", function getBody(request) {
  if (request.method !== "POST") return "-";
  return JSON.stringify(request.body);
});

app.get("/", (_, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.use("/api/persons", phonebookRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
