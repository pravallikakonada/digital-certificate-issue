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

      <div style={page}>
        <div style={overlay}>
          <div style={wrapper}>
            <div style={leftSection}>
              <div style={brandBadge}>Certificate Verification</div>
              <h1 style={mainHeading}>Digital Certificate Verification System</h1>
              <p style={subText}>
                Instantly verify the authenticity of digital certificates issued by our system.
                Enter the certificate ID to check validity, student details, and issuance status.
              </p>

              <div style={featureBox}>
                <div style={featureItem}>🔐 Secure Verification Process</div>
                <div style={featureItem}>📋 Instant Certificate Details</div>
                <div style={featureItem}>✅ Authenticity Confirmation</div>
                <div style={featureItem}>🛡️ Tamper-Proof Validation</div>
              </div>
            </div>

            <div style={rightSection}>
              <div style={card}>
                <div style={iconCircle}>🔍</div>
                <h2 style={title}>Verify Certificate</h2>
                <p style={subtitle}>Enter certificate ID to verify authenticity</p>

                <form onSubmit={handleVerify}>
                  <div style={inputGroup}>
                    <label style={label}>Certificate ID</label>
                    <input
                      type="text"
                      placeholder="Enter Certificate ID"
                      value={certificateId}
                      onChange={(e) => setCertificateId(e.target.value)}
                      style={input}
                    />
                  </div>

                  <button type="submit" style={btn}>
                    Verify Certificate
                  </button>
                </form>

                {certificate && (
                  <div style={resultBox}>
                    <div style={resultHeader}>✅ Certificate Verified Successfully</div>
                    <div style={resultDetails}>
                      <div style={detailRow}>
                        <span style={detailLabel}>Student Name:</span>
                        <span style={detailValue}>{certificate.student_name}</span>
                      </div>
                      <div style={detailRow}>
                        <span style={detailLabel}>Email:</span>
                        <span style={detailValue}>{certificate.student_email}</span>
                      </div>
                      <div style={detailRow}>
                        <span style={detailLabel}>Course:</span>
                        <span style={detailValue}>{certificate.course_title}</span>
                      </div>
                      <div style={detailRow}>
                        <span style={detailLabel}>Certificate ID:</span>
                        <span style={detailValue}>{certificate.certificate_id}</span>
                      </div>
                      <div style={detailRow}>
                        <span style={detailLabel}>Status:</span>
                        <span style={detailValue}>{certificate.status}</span>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div style={errorBox}>
                    <span style={errorIcon}>❌</span>
                    <span style={errorText}>{error}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const page = {
  minHeight: "100vh",
  background:
    "linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #334155 100%)",
};

const overlay = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px 20px",
};

const wrapper = {
  width: "100%",
  maxWidth: "1200px",
  display: "grid",
  gridTemplateColumns: "1.1fr 0.9fr",
  gap: "30px",
  alignItems: "center",
};

const leftSection = {
  padding: "20px 10px",
};

const brandBadge = {
  display: "inline-block",
  background: "#334155",
  color: "#f1f5f9",
  padding: "8px 16px",
  borderRadius: "999px",
  fontWeight: "700",
  fontSize: "14px",
  marginBottom: "18px",
  border: "1px solid #475569",
};

const mainHeading = {
  fontSize: "44px",
  lineHeight: "1.2",
  color: "#f1f5f9",
  margin: "0 0 16px 0",
  fontWeight: "800",
};

const subText = {
  fontSize: "17px",
  color: "#cbd5e1",
  lineHeight: "1.8",
  maxWidth: "620px",
  marginBottom: "26px",
};

const featureBox = {
  background: "#1e293b",
  border: "1px solid #334155",
  borderRadius: "20px",
  padding: "22px",
  boxShadow: "0 12px 30px rgba(0, 0, 0, 0.3)",
  maxWidth: "520px",
};

const featureItem = {
  fontSize: "16px",
  color: "#e2e8f0",
  marginBottom: "14px",
  fontWeight: "600",
};

const rightSection = {
  display: "flex",
  justifyContent: "center",
};

const card = {
  width: "100%",
  maxWidth: "500px",
  background: "#1e293b",
  borderRadius: "24px",
  padding: "34px 30px",
  boxShadow: "0 18px 45px rgba(0, 0, 0, 0.4)",
  border: "1px solid #334155",
  position: "relative",
};

const iconCircle = {
  width: "72px",
  height: "72px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #334155, #475569)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "32px",
  margin: "0 auto 18px auto",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
};

const title = {
  textAlign: "center",
  color: "#f1f5f9",
  margin: "0 0 8px 0",
  fontSize: "30px",
  fontWeight: "800",
};

const subtitle = {
  textAlign: "center",
  color: "#94a3b8",
  marginBottom: "24px",
  fontSize: "15px",
};

const inputGroup = {
  marginBottom: "20px",
};

const label = {
  display: "block",
  marginBottom: "8px",
  color: "#e2e8f0",
  fontWeight: "700",
  fontSize: "14px",
};

const input = {
  width: "100%",
  padding: "14px 15px",
  borderRadius: "12px",
  border: "1px solid #475569",
  boxSizing: "border-box",
  fontSize: "15px",
  outline: "none",
  background: "#334155",
  color: "#f1f5f9",
};

const btn = {
  width: "100%",
  padding: "14px",
  background: "linear-gradient(135deg, #334155, #475569)",
  color: "#f1f5f9",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "16px",
  marginTop: "8px",
  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
};

const resultBox = {
  marginTop: "24px",
  padding: "20px",
  background: "#334155",
  borderRadius: "16px",
  border: "1px solid #475569",
};

const resultHeader = {
  color: "#10b981",
  fontSize: "18px",
  fontWeight: "700",
  textAlign: "center",
  marginBottom: "16px",
};

const resultDetails = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const detailRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 0",
  borderBottom: "1px solid #475569",
};

const detailLabel = {
  color: "#cbd5e1",
  fontWeight: "600",
  fontSize: "14px",
};

const detailValue = {
  color: "#f1f5f9",
  fontWeight: "500",
  fontSize: "14px",
  textAlign: "right",
};

const errorBox = {
  marginTop: "20px",
  padding: "16px",
  background: "#dc2626",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const errorIcon = {
  fontSize: "18px",
};

const errorText = {
  color: "#fef2f2",
  fontWeight: "600",
  fontSize: "15px",
};

export default VerifyCertificate;