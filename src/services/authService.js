import api from "./api.js";

export async function signupUser(data) {
  const response = await api.post("/accounts/signup/", data);
  return response.data;
}

export async function loginUser(data) {
  const response = await api.post("/accounts/login/", data);
  return response.data;
}

export async function getMyCertificate(email) {
  const response = await api.get(`/accounts/my-certificate/${email}/`);
  return response.data;
}