import React, { useState } from "react";
import axios from "axios";
import Header from "../components/Header";

const VerifyCertificate = () => {
  const [certificateId, setCertificateId] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    setCertificate(null);
    setError("");

    if (!certificateId.trim()) {
      alert("Please enter a certificate ID");
      return;
    }

    try {
      const response = await axios.get(
        `https://certificate-backend-mxjt.onrender.com/api/certificates/verify/${certificateId.trim()}/`
      );

      setCertificate(response.data);
    } catch (err) {
      console.error("Verify error:", err?.response?.data || err);
      setError("Invalid Certificate ID ❌");
    }
  };

  return (
    <>
      <Header />

      <div style={container}>
        <div style={card}>
          <h1 style={title}>Verify Certificate</h1>

          <form onSubmit={handleVerify}>
            <input
              type="text"
              placeholder="Enter Certificate ID"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              style={input}
            />

            <button type="submit" style={btn}>
              Verify
            </button>
          </form>

          {certificate && (
            <div style={resultBox}>
              <p><b>Name:</b> {certificate.student_name}</p>
              <p><b>Email:</b> {certificate.student_email}</p>
              <p><b>Course:</b> {certificate.course_title}</p>
              <p><b>Certificate ID:</b> {certificate.certificate_id}</p>
              <p><b>Status:</b> {certificate.status}</p>
              <p style={{ color: "green", fontWeight: "bold" }}>
                Certificate Verified Successfully ✅
              </p>
            </div>
          )}

          {error && (
            <p style={{ color: "red", marginTop: "15px" }}>{error}</p>
          )}
        </div>
      </div>
    </>
  );
};

const container = {
  minHeight: "100vh",
  background: "#eef4ff",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
};

const card = {
  width: "100%",
  maxWidth: "600px",
  background: "#fff",
  padding: "30px",
  borderRadius: "20px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
};

const title = {
  color: "#1e3a8a",
  marginBottom: "20px",
};

const input = {
  width: "100%",
  padding: "14px",
  marginBottom: "16px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "16px",
  boxSizing: "border-box",
};

const btn = {
  padding: "12px 28px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "600",
};

const resultBox = {
  marginTop: "20px",
  padding: "18px",
  background: "#f8fafc",
  borderRadius: "12px",
  border: "1px solid #ddd",
};

export default VerifyCertificate;