import axios from "axios";

const BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:7000";

const instance = axios.create({
  baseURL: BASE + "/api",
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
