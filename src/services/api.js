import axios from "axios";

// Normalize the API base URL for local and remote environments.
// Keep absolute paths working with the Vite proxy and avoid duplicate /api/api paths.
const rawBaseURL = import.meta.env.VITE_API_BASE_URL || "";
const prodFallbackBaseURL = "https://digital-certificate-backend-csac.onrender.com/api";
const devFallbackBaseURL = "http://127.0.0.1:8000/api";
const baseURL = rawBaseURL.replace(/\/+$/, "") || (import.meta.env.PROD ? prodFallbackBaseURL : devFallbackBaseURL);

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
  withCredentials: true, // Include cookies for CSRF token
});

api.interceptors.request.use((config) => {
  if (config.baseURL && config.url && config.url.startsWith("/")) {
    const normalizedBase = config.baseURL.replace(/\/+$/, "");
    if (normalizedBase.endsWith("/api") && config.url.startsWith("/api")) {
      config.url = config.url.replace(/^\/api/, "");
    }
  }
  
  // Log request details for debugging
  console.log(`[API REQUEST] ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
  
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`[API SUCCESS] ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    // Enhanced error logging
    const status = error?.response?.status;
    const message = error?.message;
    
    console.error("[API ERROR] Details:", {
      status,
      statusText: error?.response?.statusText,
      message,
      url: error?.config?.url,
      method: error?.config?.method,
      data: error?.response?.data,
    });
    
    // Provide helpful debugging info
    if (status === 403) {
      console.error("[DEBUG 403] This is likely a CSRF or permission issue. Check:");
      console.error("  - Is backend running?");
      console.error("  - Is CORS configured correctly?");
      console.error("  - Are API routes correct?");
    } else if (status === 404) {
      console.error("[DEBUG 404] API endpoint not found. Check:");
      console.error("  - Is the endpoint URL correct?");
      console.error("  - Did you restart Django after changes?");
    } else if (!error?.response) {
      console.error("[DEBUG NETWORK] Network error - backend might be offline");
      console.error("  Check: http://127.0.0.1:8000");
    }
    
    return Promise.reject(error);
  }
);

export default api;