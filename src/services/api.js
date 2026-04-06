import axios from "axios";

// Normalize the API base URL for local and remote environments.
// Keep absolute paths working with the Vite proxy and avoid duplicate /api/api paths.
const rawBaseURL = import.meta.env.VITE_API_BASE_URL || "";
const baseURL = rawBaseURL.replace(/\/+$/, "");

if (import.meta.env.PROD && !rawBaseURL) {
  console.warn(
    "VITE_API_BASE_URL is not set in production. API requests will use relative paths. " +
    "If your backend is hosted separately, set VITE_API_BASE_URL to the backend API base URL."
  );
}

console.log("API Configuration:", {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  calculatedBaseURL: baseURL,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
});

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