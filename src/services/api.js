import axios from "axios";

// Normalize the API base URL for local and remote environments.
// Keep absolute paths working with the Vite proxy and avoid duplicate /api/api paths.
const rawBaseURL = import.meta.env.VITE_API_BASE_URL || "";
const prodFallbackBaseURL = "https://digital-certificate-backend-csac.onrender.com/api";
const baseURL = rawBaseURL.replace(/\/+$/, "") || (import.meta.env.PROD ? prodFallbackBaseURL : "");

if (import.meta.env.PROD && !rawBaseURL) {
  console.warn(
    "VITE_API_BASE_URL is not set in production. Falling back to the hosted backend API URL.",
    `using ${prodFallbackBaseURL}`
  );
}

console.log("API Configuration:", {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  calculatedBaseURL: baseURL,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
});

const api = axios.create({
  baseURL: baseURL || undefined,
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