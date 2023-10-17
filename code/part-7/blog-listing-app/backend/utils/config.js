require("dotenv").config();

const PORT = process.env.PORT;

const NODE_ENV = process.env.NODE_ENV;

const MONGODB_URI =
  NODE_ENV === "test" ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI;

const SECRET = process.env.SECRET;

const TOKEN_EXPIRES_IN =
  NODE_ENV === "test"
    ? process.env.TEST_JWT_TOKEN_EXPIRES_IN
    : process.env.JWT_TOKEN_EXPIRES_IN;

module.exports = {
  PORT,
  MONGODB_URI,
  NODE_ENV,
  SECRET,
  TOKEN_EXPIRES_IN,
};
