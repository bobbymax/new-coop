import { API } from "../utils";
import axios from "axios";

export const login = async (data) => {
  const { staff_no, password } = data;
  return await axios.post(`${API.url}login`, { staff_no, password });
};
