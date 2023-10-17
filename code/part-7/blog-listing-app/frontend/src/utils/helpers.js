import constants from "./constants";

const getErrorMessage = (error) =>
  error.response.data.error || error.message || constants.DEFAULT_ERROR_MESSAGE;

const getLoggedInUserName = () =>
  JSON.parse(
    window.localStorage.getItem(constants.BROWSER_STORAGE_USER_NAME_kEY)
  )?.username || null;

export default { getErrorMessage, getLoggedInUserName };
