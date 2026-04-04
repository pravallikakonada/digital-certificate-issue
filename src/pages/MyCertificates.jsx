import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import api from "../services/api";

const MyCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const studentEmail = localStorage.getItem("studentEmail");

  useEffect(() => {
    if (!studentEmail) {
      setLoading(false);
      return;
    }

    const fetchCertificates = async () => {
      try {
        const response = await api.get("/api/certificates/");
        const allCertificates = response.data || [];

        const myCertificates = allCertificates.filter(
          (cert) => cert.student_email === studentEmail
        );

        setCertificates(myCertificates);
      } catch (error) {
        console.error("Error fetching certificates:", error);
        alert("Failed to load certificates. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [studentEmail]);

  const handleDownload = (cert) => {
    if (!cert) {
      alert("Certificate data is not available");
      return;
    }

    const content = `
DIGITAL CERTIFICATE OF COMPLETION

Certificate of Achievement

This is to certify that

${cert.student_name || 'Unknown Student'}

has successfully completed the course

${cert.course_title || 'Unknown Course'}

with outstanding performance and dedication.

Certificate ID: ${cert.certificate_id || 'N/A'}
Issue Date: ${new Date().toLocaleDateString()}
Status: ${cert.status || 'Unknown'}

Authorized Signature
_________________________
Admin Officer
Digital Certificate System

This certificate is digitally generated and verified.
    `;

    try {
      const blob = new Blob([content], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Certificate_${cert.certificate_id || 'Unknown'}.txt`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading certificate:", error);
      alert("Failed to download certificate");
    }
  };

  const handleViewCertificate = (cert) => {
    if (!cert) {
      alert("Certificate data is not available");
      return;
    }
    setSelectedCertificate(cert);
  };

  const closeCertificate = () => {
    setSelectedCertificate(null);
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <Header />

      <div style={container}>
        <div style={content}>
          <h1 style={title}>My Certificates</h1>

          {loading ? (
            <div style={loadingContainer}>
              <div style={spinner}></div>
              <p>Loading certificates...</p>
            </div>
          ) : !studentEmail ? (
            <div style={emptyState}>
              <h3>Login Required</h3>
              <p>Please log in to view your certificates.</p>
            </div>
          ) : certificates.length === 0 ? (
            <div style={emptyState}>
              <h3>No Certificates Found</h3>
              <p>You haven't received any certificates yet. Complete your exams to earn certificates!</p>
            </div>
          ) : (
            <div style={certificatesGrid}>
              {certificates.map((cert) => (
                <div key={cert.certificate_id || cert.id} style={certificateCard}>
                  <div style={cardHeader}>
                    <h3 style={courseTitle}>{cert.course_title || 'Unknown Course'}</h3>
                    <span style={statusBadge}>✓ {cert.status || 'Unknown'}</span>
                  </div>

                  <div style={cardBody}>
                    <div style={infoRow}>
                      <span style={label}>Certificate ID:</span>
                      <span style={value}>{cert.certificate_id || 'N/A'}</span>
                    </div>

                    <div style={infoRow}>
                      <span style={label}>Student:</span>
                      <span style={value}>{cert.student_name || 'Unknown'}</span>
                    </div>

                    <div style={infoRow}>
                      <span style={label}>Email:</span>
                      <span style={value}>{cert.student_email || 'Unknown'}</span>
                    </div>
                  </div>

                  <div style={cardFooter}>
                    <button
                      style={viewBtn}
                      onClick={() => handleViewCertificate(cert)}
                    >
                      👁️ View Certificate
                    </button>
                    <button
                      style={downloadBtn}
                      onClick={() => handleDownload(cert)}
                    >
                      📥 Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Certificate Modal */}
        {selectedCertificate && (
          <div style={modalOverlay} onClick={closeCertificate}>
            <div style={certificateModal} onClick={(e) => e.stopPropagation()}>
              <div style={certificateDesign}>
                {/* Certificate Header */}
                <div style={certHeader}>
                  <div style={headerDecoration}>
                    <div style={decorationLine}></div>
                    <div style={decorationCircle}></div>
                    <div style={decorationLine}></div>
                  </div>
                  <h1 style={certTitle}>Certificate of Completion</h1>
                  <p style={certSubtitle}>Digital Achievement Certificate</p>
                </div>

                {/* Certificate Body */}
                <div style={certBody}>
                  <p style={certText}>This is to certify that</p>
                  <h2 style={studentName}>{selectedCertificate.student_name || 'Unknown Student'}</h2>
                  <p style={certText}>has successfully completed the course</p>
                  <h3 style={courseName}>{selectedCertificate.course_title || 'Unknown Course'}</h3>
                  <p style={certText}>with excellent performance and dedication to learning.</p>
                </div>

                {/* Certificate Details */}
                <div style={certDetails}>
                  <div style={detailRow}>
                    <span style={detailLabel}>Certificate ID:</span>
                    <span style={detailValue}>{selectedCertificate.certificate_id || 'N/A'}</span>
                  </div>
                  <div style={detailRow}>
                    <span style={detailLabel}>Issue Date:</span>
                    <span style={detailValue}>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div style={detailRow}>
                    <span style={detailLabel}>Status:</span>
                    <span style={detailValue}>{selectedCertificate.status || 'Unknown'}</span>
                  </div>
                </div>

                {/* Signature Section */}
                <div style={signatureSection}>
                  <div style={signatureBox}>
                    <div style={signatureLine}></div>
                    <p style={signatureText}>Authorized Signature</p>
                    <p style={signatureName}>Admin Officer</p>
                    <p style={signatureTitle}>Digital Certificate System</p>
                  </div>

                  <div style={stampBox}>
                    <div style={stamp}>
                      <div style={stampInner}>
                        <span style={stampText}>VERIFIED</span>
                        <span style={stampDate}>{new Date().getFullYear()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div style={certFooter}>
                  <p style={footerText}>This certificate is digitally generated and verified by the Digital Certificate System.</p>
                </div>
              </div>

              <div style={modalActions}>
                <button style={downloadModalBtn} onClick={() => handleDownload(selectedCertificate)}>
                  📥 Download Certificate
                </button>
                <button style={closeBtn} onClick={closeCertificate}>
                  ✕ Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const container = {
  minHeight: "100vh",
  width: "100vw",
  padding: "32px 18px",
  background: "#f3f4f6",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  boxSizing: "border-box",
};

const content = {
  width: "min(1200px, 100%)",
  display: "grid",
  gap: "24px",
};

const title = {
  margin: "0 0 8px",
  fontSize: "32px",
  color: "#0f172a",
  textAlign: "center",
  fontWeight: "700",
};

const loadingContainer = {
  textAlign: "center",
  padding: "60px 20px",
  background: "white",
  borderRadius: "16px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
};

const spinner = {
  width: "40px",
  height: "40px",
  border: "4px solid #e2e8f0",
  borderTop: "4px solid #3b82f6",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  margin: "0 auto 20px",
};

const emptyState = {
  textAlign: "center",
  padding: "60px 20px",
  background: "white",
  borderRadius: "16px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
};

const certificatesGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
  gap: "20px",
};

const certificateCard = {
  background: "white",
  borderRadius: "16px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  overflow: "hidden",
  transition: "transform 0.2s, box-shadow 0.2s",
  border: "2px solid #e5e7eb",
};

const cardHeader = {
  padding: "20px 20px 0 20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
};

const courseTitle = {
  margin: 0,
  fontSize: "18px",
  color: "#0f172a",
  fontWeight: "600",
  lineHeight: 1.3,
};

const statusBadge = {
  padding: "6px 12px",
  borderRadius: "20px",
  background: "#dcfce7",
  color: "#166534",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  whiteSpace: "nowrap",
};

const cardBody = {
  padding: "16px 20px",
};

const infoRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "8px",
  gap: "8px",
};

const label = {
  fontWeight: "500",
  color: "#64748b",
  fontSize: "14px",
};

const value = {
  fontWeight: "500",
  color: "#0f172a",
  fontSize: "14px",
  textAlign: "right",
  flex: 1,
};

const cardFooter = {
  padding: "0 20px 20px 20px",
  display: "flex",
  gap: "12px",
};

const viewBtn = {
  flex: 1,
  padding: "10px 16px",
  background: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
  transition: "background-color 0.2s",
};

const downloadBtn = {
  flex: 1,
  padding: "10px 16px",
  background: "#10b981",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
  transition: "background-color 0.2s",
};

// Modal Styles
const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0, 0, 0, 0.75)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  padding: "20px",
};

const certificateModal = {
  background: "white",
  borderRadius: "16px",
  maxWidth: "900px",
  width: "100%",
  maxHeight: "90vh",
  overflow: "auto",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
};

const certificateDesign = {
  padding: "40px",
  background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
  borderRadius: "16px 16px 0 0",
  position: "relative",
};

const certHeader = {
  textAlign: "center",
  marginBottom: "40px",
};

const headerDecoration = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "20px",
  gap: "20px",
};

const decorationLine = {
  height: "2px",
  background: "linear-gradient(90deg, #3b82f6, #1d4ed8)",
  flex: 1,
  borderRadius: "1px",
};

const decorationCircle = {
  width: "12px",
  height: "12px",
  background: "#3b82f6",
  borderRadius: "50%",
  border: "3px solid white",
  boxShadow: "0 0 0 2px #3b82f6",
};

const certTitle = {
  margin: "0 0 8px 0",
  fontSize: "36px",
  color: "#0f172a",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "2px",
};

const certSubtitle = {
  margin: 0,
  fontSize: "16px",
  color: "#64748b",
  fontWeight: "500",
  textTransform: "uppercase",
  letterSpacing: "1px",
};

const certBody = {
  textAlign: "center",
  marginBottom: "40px",
};

const certText = {
  margin: "12px 0",
  fontSize: "16px",
  color: "#475569",
  lineHeight: 1.6,
};

const studentName = {
  margin: "20px 0",
  fontSize: "28px",
  color: "#0f172a",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "1px",
};

const courseName = {
  margin: "20px 0",
  fontSize: "22px",
  color: "#1d4ed8",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "1px",
};

const certDetails = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "40px",
  border: "2px solid #e5e7eb",
};

const detailRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "8px",
  padding: "4px 0",
};

const detailLabel = {
  fontWeight: "600",
  color: "#64748b",
  fontSize: "14px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const detailValue = {
  fontWeight: "600",
  color: "#0f172a",
  fontSize: "14px",
};

const signatureSection = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "40px",
  gap: "40px",
};

const signatureBox = {
  flex: 1,
  textAlign: "center",
};

const signatureLine = {
  width: "200px",
  height: "2px",
  background: "#0f172a",
  margin: "0 auto 8px",
  borderRadius: "1px",
};

const signatureText = {
  margin: "4px 0",
  fontSize: "14px",
  color: "#64748b",
  fontWeight: "500",
};

const signatureName = {
  margin: "4px 0",
  fontSize: "16px",
  color: "#0f172a",
  fontWeight: "600",
};

const signatureTitle = {
  margin: "4px 0",
  fontSize: "12px",
  color: "#64748b",
  fontStyle: "italic",
};

const stampBox = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
};

const stamp = {
  width: "120px",
  height: "120px",
  borderRadius: "50%",
  border: "4px solid #dc2626",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
  boxShadow: "0 4px 8px rgba(220, 38, 38, 0.3)",
};

const stampInner = {
  width: "100px",
  height: "100px",
  borderRadius: "50%",
  border: "2px solid #dc2626",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "white",
};

const stampText = {
  fontSize: "12px",
  fontWeight: "700",
  color: "#dc2626",
  textTransform: "uppercase",
  letterSpacing: "1px",
};

const stampDate = {
  fontSize: "10px",
  fontWeight: "600",
  color: "#dc2626",
  marginTop: "2px",
};

const certFooter = {
  textAlign: "center",
  paddingTop: "20px",
  borderTop: "2px solid #e5e7eb",
};

const footerText = {
  margin: 0,
  fontSize: "12px",
  color: "#64748b",
  fontStyle: "italic",
};

const modalActions = {
  padding: "20px 40px",
  display: "flex",
  gap: "16px",
  justifyContent: "center",
  background: "#f8fafc",
  borderRadius: "0 0 16px 16px",
};

const downloadModalBtn = {
  padding: "12px 24px",
  background: "#10b981",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
  transition: "background-color 0.2s",
};

const closeBtn = {
  padding: "12px 24px",
  background: "#6b7280",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
  transition: "background-color 0.2s",
};

export default MyCertificates;