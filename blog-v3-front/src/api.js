// src/api.js
import axios from "axios";
export const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const api = axios.create({ baseURL, withCredentials: true });
export default api;
