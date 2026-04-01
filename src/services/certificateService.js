import api from "./api.js";

// Verify certificate by certificate ID
export async function verifyCertificate(id) {
  const response = await api.get(`/certificates/verify/${id}/`);
  return response.data;
}

// Issue new certificate
export async function issueCertificate(data) {
  const response = await api.post("/certificates/", data);
  return response.data;
}

// Get all certificates
export async function getAllCertificates() {
  const response = await api.get("/certificates/");
  return response.data;
}

// Get my certificates by email
export async function getMyCertificates(email) {
  const response = await api.get(`/accounts/my-certificate/${email}/`);
  return response.data;
}

// Upload CSV
export async function uploadCSV(formData) {
  const response = await api.post("/certificates/upload-csv/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}