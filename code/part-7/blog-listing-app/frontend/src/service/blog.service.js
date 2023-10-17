import axios from "axios";
import constants from "../utils/constants";

const API_URL = `${constants.API_BASE_URL}/blogs/`;
let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios(API_URL);
  return response.data;
};

const get = async (id) => {
  const response = await axios(`${API_URL}/${id}`);
  return response.data;
};

const create = async (payload) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(API_URL, payload, config);
  return response.data;
};

const update = async (id, payload) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.put(`${API_URL}/${id}`, payload, config);
  return response.data;
};

const remove = async (id, payload) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.delete(`${API_URL}/${id}`, payload, config);
  return response.data;
};

export default {
  setToken,
  getAll,
  get,
  create,
  update,
  remove,
};
