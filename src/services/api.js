import axios from "axios";

const api = axios.create({
  baseURL: "https://certificate-backend-mxjt.onrender.com",
});

export default api;