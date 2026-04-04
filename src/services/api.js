import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "https://certificate-backend-mxjt.onrender.com";

const api = axios.create({
  baseURL,
});

export default api;