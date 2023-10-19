import axios from "axios";
import constants from "../utils/constants";

const API_URL = `${constants.API_BASE_URL}/users`;

const getAll = async () => {
  const response = await axios(API_URL);
  return response.data;
};

export default { getAll };
