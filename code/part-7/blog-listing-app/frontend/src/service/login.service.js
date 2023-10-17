import axios from "axios";
import constants from "../utils/constants";

const API_LOGIN_URL = `${constants.API_BASE_URL}/login`;

async function login(credentials) {
  const response = await axios.post(API_LOGIN_URL, credentials);
  return response.data;
}

export default { login };
