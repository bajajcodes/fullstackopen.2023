const URL_REGEX =
  // eslint-disable-next-line no-useless-escape
  /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

const USERNAME_RGEX = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}/;

module.exports = {
  URL_REGEX,
  USERNAME_RGEX,
};
