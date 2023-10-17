const jwt = require("jsonwebtoken");
const logger = require("./logger");
const config = require("./config");
const User = require("../models/user");

const requestLogger = (request, _, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body || "NA");
  logger.info("---");
  next();
};

const unknownEndpoint = (_, response) => {
  return response.status(404).send({ error: "Unknown Endpoint" });
};

const errorHandler = (error, _, response, next) => {
  switch (error.name) {
    case "CastError":
      return response.status(400).send({ error: "malformatted ID" });
    case "ValidationError":
      return response.status(400).json({ error: error.message });
    case "JsonWebTokenError":
      return response.status(401).json({ error: error.message });
    case "TokenExpiredError":
      return response.status(401).json({ error: "token expired" });
  }

  next(error);
};

const verifyToken = (request, response, next) => {
  const token = request.token;
  if (!token) {
    return response.status(401).json({ error: "token is missing" });
  }

  const decodedToken = jwt.verify(token, config.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  request.decodedToken = decodedToken;
  next();
};

const tokenExtractor = (request, _, next) => {
  let token = null;
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    token = authorization.replace("Bearer ", "");
  }
  request.token = token;
  next();
};

const userExtractor = async (request, response, next) => {
  const user = await User.findById(request.decodedToken.id);
  if (!user) return response.status(400).send({ error: "user not found" });
  request.user = user;
  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  verifyToken,
  tokenExtractor,
  userExtractor,
};
