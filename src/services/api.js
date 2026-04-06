import axios from "axios";

// Normalize the API base URL for local and remote environments.
// Keep absolute paths working with the Vite proxy and avoid duplicate /api/api paths.
const rawBaseURL = import.meta.env.VITE_API_BASE_URL || "";
const baseURL = rawBaseURL.replace(/\/+$/, "");

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  if (config.baseURL && config.url && config.url.startsWith("/")) {
    const normalizedBase = config.baseURL.replace(/\/+$/, "");
    if (normalizedBase.endsWith("/api") && config.url.startsWith("/api")) {
      config.url = config.url.replace(/^\/api/, "");
    }
  }
  return config;
});

export default api;