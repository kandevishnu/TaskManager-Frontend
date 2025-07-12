// src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://taskmanager-backend-production-4c43.up.railway.app/api",
  withCredentials: true,
});

export default api;

