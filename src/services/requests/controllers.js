import { API } from "../utils";
import authHeader from "./auth.header";
import axios from "axios";

export const collection = async (entity) => {
  return await axios.get(`${API.url + entity}`, { headers: authHeader() });
};

export const bulk = async (entity, body) => {
  return await axios.post(`${API.url + entity}`, body, {
    headers: authHeader(),
  });
};

export const fetch = async (entity, id) => {
  return await axios.get(`${API.url + entity}/${id}`, {
    headers: authHeader(),
  });
};

export const store = async (entity, body) => {
  return await axios.post(`${API.url + entity}`, body, {
    headers: authHeader(),
  });
};

export const alter = async (entity, id, body) => {
  return await axios.patch(`${API.url + entity}/${id}`, body, {
    headers: authHeader(),
  });
};

export const destroy = async (entity, id) => {
  return await axios.delete(`${API.url + entity}/${id}`, {
    headers: authHeader(),
  });
};

export const batchRequests = async (...arrRequests) => {
  const result = await axios.all(...arrRequests);
  return Promise.resolve(result);
};
