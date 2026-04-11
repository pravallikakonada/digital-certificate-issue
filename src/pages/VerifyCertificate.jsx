import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const VerifyCertificate = () => {
  const { id } = useParams();
  const [certificateId, setCertificateId] = useState(id || "");
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    if (id) {
      handleVerify(null, id);
    }
  }, [id]);

  const handleVerify = async (e, certId = certificateId) => {
    if (e) e.preventDefault();

    setCertificate(null);
    setError("");
    setLoading(true);

    if (!certId.trim()) {
      alert("Please enter a certificate ID");
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(
        `/api/certificates/verify/${certId.trim()}/`
      );

      setCertificate(response.data);
    } catch (err) {
      console.error("Verify error:", err?.response?.data || err);
      setError("Invalid Certificate ID ❌ Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          input:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
          }
        `}
      </style>
      <div style={container}>
        <div style={wrapper}>
          {/* Left Section */}
          <div style={leftSection}>
            <div style={brandSection}>
              <div style={brandIcon}>🔐</div>
              <h1 style={brandTitle}>Verify Certificates</h1>
              <p style={brandSubtitle}>Confirm Authenticity & Validity</p>
            </div>

            <div style={featuresSection}>
              <div style={featureItem}>
                <div style={featureIcon}>✓</div>
                <div>
                  <h3 style={featureTitle}>Instant Verification</h3>
                  <p style={featureDesc}>Check certificate authenticity in seconds</p>
                </div>
              </div>

              <div style={featureItem}>
                <div style={featureIcon}>🔍</div>
                <div>
                  <h3 style={featureTitle}>Detailed Information</h3>
                  <p style={featureDesc}>View student and course details</p>
                </div>
              </div>

              <div style={featureItem}>
                <div style={featureIcon}>🛡️</div>
                <div>
                  <h3 style={featureTitle}>Tamper-Proof</h3>
                  <p style={featureDesc}>Digitally secured validation</p>
                </div>
              </div>

              <div style={featureItem}>
                <div style={featureIcon}>📱</div>
                <div>
                  <h3 style={featureTitle}>QR Scanning</h3>
                  <p style={featureDesc}>Scan QR codes for quick verification</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div style={rightSection}>
            <div style={formCard}>
              <div style={formHeader}>
                <h2 style={formTitle}>Verify Certificate</h2>
                <p style={formSubtitle}>Enter certificate ID to verify</p>
              </div>

              <form onSubmit={handleVerify} style={form}>
                {/* Certificate ID Input */}
                <div style={inputWrapper}>
                  <label style={label}>Certificate ID</label>
                  <div style={{
                    ...inputContainer,
                    borderColor: focusedField === 'certId' ? '#10b981' : '#e5e7eb',
                    boxShadow: focusedField === 'certId' ? '0 0 0 3px rgba(16, 185, 129, 0.1)' : 'none'
                  }}>
                    <span style={inputIcon}>🆔</span>
                    <input
                      type="text"
                      placeholder="e.g., CERT-2024-12345"
                      value={certificateId}
                      onChange={(e) => setCertificateId(e.target.value)}
                      onFocus={() => setFocusedField('certId')}
                      onBlur={() => setFocusedField(null)}
                      style={inputField}
                    />
                  </div>
                </div>

                <button type="submit" style={btnStyle} disabled={loading}>
                  <span style={{marginRight: '8px'}}>🔍</span>
                  {loading ? "Verifying..." : "Verify Certificate"}
                </button>
              </form>

              {certificate && (
                <div style={resultBox}>
                  <div style={resultHeader}>✅ Certificate Verified</div>
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
                    <div style={detailRow}>
                      <span style={detailLabel}>Template:</span>
                      <span style={detailValue}>{certificate.template}</span>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div style={errorBox}>
                  <span style={errorIcon}>⚠️</span>
                  <span style={errorText}>{error}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const container = {
  minHeight: "100vh",
  background: "radial-gradient(circle at top, rgba(16, 185, 129, 0.25), transparent 35%), linear-gradient(180deg, #0f172a 0%, #0f766e 45%, #10b981 100%)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "24px",
};

const responsiveWrapper = {
  width: "100%",
  maxWidth: "1200px",
  display: "grid",
  gridTemplateColumns: window.innerWidth <= 768 ? "1fr" : "1.05fr 0.95fr",
  gap: "36px",
  alignItems: "stretch",
};

const wrapper = responsiveWrapper;

const leftSection = {
  display: window.innerWidth <= 768 ? "none" : "block",
  animation: "slideInLeft 0.8s ease-out",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: "28px",
  padding: "32px",
  boxShadow: "0 35px 80px rgba(15,23,42,0.25)",
};

const brandSection = {
  marginBottom: "36px",
};

const brandIcon = {
  width: "72px",
  height: "72px",
  borderRadius: "24px",
  background: "rgba(255,255,255,0.18)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "32px",
  marginBottom: "18px",
};

const brandTitle = {
  fontSize: "38px",
  fontWeight: "800",
  color: "white",
  margin: "0 0 12px 0",
  lineHeight: "1.1",
};

const brandSubtitle = {
  fontSize: "16px",
  color: "rgba(255,255,255,0.83)",
  margin: 0,
  lineHeight: "1.7",
};

const featuresSection = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "18px",
};

const featureItem = {
  display: "flex",
  gap: "14px",
  animation: "slideInLeft 0.8s ease-out",
  background: "rgba(255,255,255,0.08)",
  borderRadius: "18px",
  padding: "18px",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
};

const featureIcon = {
  width: "52px",
  height: "52px",
  borderRadius: "16px",
  background: "rgba(255,255,255,0.16)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  flexShrink: 0,
};

const featureTitle = {
  color: "white",
  fontSize: "15px",
  fontWeight: "700",
  margin: "0 0 6px 0",
};

const featureDesc = {
  color: "rgba(255,255,255,0.72)",
  fontSize: "13px",
  margin: 0,
  lineHeight: "1.6",
};

const rightSection = {
  display: "flex",
  justifyContent: "center",
  animation: "slideInRight 0.8s ease-out",
};

const formCard = {
  width: "100%",
  maxWidth: "450px",
  background: "rgba(255,255,255,0.95)",
  borderRadius: "28px",
  padding: "34px",
  boxShadow: "0 35px 80px rgba(15,23,42,0.18)",
  border: "1px solid rgba(16,185,129,0.15)",
};

const formHeader = {
  marginBottom: "28px",
  textAlign: "center",
};

const formTitle = {
  color: "#0f172a",
  fontSize: "28px",
  fontWeight: "800",
  margin: "0 0 10px 0",
};

const formSubtitle = {
  color: "#4b5563",
  fontSize: "15px",
  margin: 0,
  lineHeight: "1.7",
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};

const inputWrapper = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const label = {
  color: "#0f172a",
  fontSize: "13px",
  fontWeight: "700",
};

const inputContainer = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "14px 16px",
  border: "1px solid #cbd5e1",
  borderRadius: "14px",
  transition: "all 0.3s ease",
  backgroundColor: "#f8fafc",
};

const inputIcon = {
  fontSize: "20px",
  color: "#16a34a",
};

const inputField = {
  flex: 1,
  border: "none",
  outline: "none",
  fontSize: "15px",
  background: "transparent",
  color: "#111827",
  fontFamily: "inherit",
};

const btnStyle = {
  padding: "14px 16px",
  background: "linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)",
  color: "white",
  border: "none",
  borderRadius: "14px",
  fontSize: "15px",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow: "0 18px 45px rgba(20,184,166,0.22)",
  transition: "transform 0.2s ease, opacity 0.2s ease",
  marginTop: "8px",
};

const resultBox = {
  marginTop: "24px",
  padding: "22px",
  background: "linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%)",
  border: "1px solid #6ee7b7",
  borderRadius: "18px",
  boxShadow: "0 24px 60px rgba(16,185,129,0.12)",
};

const resultHeader = {
  color: "#065f46",
  fontSize: "16px",
  fontWeight: "800",
  marginBottom: "14px",
};

const resultDetails = {
  display: "grid",
  gap: "14px",
};

const detailRow = {
  display: "grid",
  gridTemplateColumns: "1fr 1.1fr",
  gap: "16px",
  alignItems: "center",
  fontSize: "14px",
};

const detailLabel = {
  color: "#134e4a",
  fontWeight: "700",
};

const detailValue = {
  color: "#064e3b",
  fontWeight: "700",
  textAlign: "right",
};

const errorBox = {
  marginTop: "20px",
  padding: "12px 16px",
  background: "#fee2e2",
  border: "1px solid #fca5a5",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const errorIcon = {
  fontSize: "16px",
  flexShrink: 0,
};

const errorText = {
  color: "#dc2626",
  fontSize: "13px",
  fontWeight: "600",
};

export default VerifyCertificate;
