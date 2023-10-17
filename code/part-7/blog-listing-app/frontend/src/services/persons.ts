import axios from "axios";
import { Person } from "../components/persons-app";

const BASE_URL = "/api/persons";

const getAll = async () => {
  const request = axios.get(BASE_URL);
  const response = await request;
  return response.data;
};

const create = async (newObject: Omit<Person, "id">) => {
  const request = axios.post(BASE_URL, newObject);
  const response = await request;
  return response.data;
};

const update = async (id: string, newObject: Person) => {
  const request = axios.put(`${BASE_URL}/${id}`, newObject);
  const response = await request;
  return response.data;
};

const remove = async (id: string) => {
  const request = axios.delete(`${BASE_URL}/${id}`);
  const response = await request;
  return response.data;
};

export default { getAll, create, update, remove };
