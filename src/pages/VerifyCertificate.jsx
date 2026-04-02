import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";

const API_BASE_URL = "http://192.168.29.45:8000";

const VerifyCertificate = () => {
  const [certificateId, setCertificateId] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const certIdFromUrl = params.get("certificateId");

    if (certIdFromUrl) {
      setCertificateId(certIdFromUrl);
      handleVerifyById(certIdFromUrl);
    }
  }, []);

  const handleVerifyById = async (id) => {
    setError("");
    setCertificate(null);
    setSearched(false);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/certificates/verify/${id}/`
      );

      setCertificate(response.data);
      setSearched(true);
    } catch (err) {
      console.error("Verify error:", err);
      setError("Invalid Certificate ❌");
      setSearched(true);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!certificateId) {
      setError("Please enter certificate ID");
      setCertificate(null);
      setSearched(true);
      return;
    }

    await handleVerifyById(certificateId);
  };

  return (
    <>
      <Header />

      <div
        style={{
          minHeight: "100vh",
          background: "#eef2ff",
          padding: "30px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            background: "#fff",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          }}
        >
          <h1 style={{ color: "#1e3a8a", marginTop: 0 }}>
            Verify Certificate
          </h1>

          <form onSubmit={handleVerify}>
            <input
              type="text"
              placeholder="Enter Certificate ID"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              style={inputStyle}
            />

            <button type="submit" style={btnStyle}>
              Verify
            </button>
          </form>

          {error && (
            <p
              style={{
                color: "red",
                marginTop: "20px",
                fontSize: "20px",
                fontWeight: "600",
              }}
            >
              {error}
            </p>
          )}

          {certificate && (
            <div
              style={{
                marginTop: "30px",
                background: "#f8fafc",
                padding: "22px",
                borderRadius: "14px",
                border: "1px solid #dbeafe",
              }}
            >
              <p><b>Name:</b> {certificate.student_name}</p>
              <p><b>Email:</b> {certificate.student_email}</p>
              <p><b>Course:</b> {certificate.course_title}</p>
              <p><b>Certificate ID:</b> {certificate.certificate_id}</p>
              <p><b>Status:</b> {certificate.status}</p>
              <p style={{ color: "green", fontWeight: "700" }}>
                Valid Certificate ✅
              </p>
            </div>
          )}

          {searched && !certificate && !error && (
            <p>No certificate data found.</p>
          )}
        </div>
      </div>
    </>
  );
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  marginBottom: "16px",
  boxSizing: "border-box",
  fontSize: "16px",
};

const btnStyle = {
  padding: "12px 24px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "16px",
};

export default VerifyCertificate;