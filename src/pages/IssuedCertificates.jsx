import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const IssuedCertificates = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/admin-login");
    }

    fetchCertificates();
  }, [navigate]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/certificates/");
      setCertificates(response.data || []);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      alert("Failed to load certificates. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCertificates = certificates.filter((cert) =>
    cert.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.student_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.course_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.certificate_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (cert) => {
    setSelectedCertificate(cert);
  };

  const handleCloseModal = () => {
    setSelectedCertificate(null);
  };

  const handleDownload = (cert) => {
    const content = `
DIGITAL CERTIFICATE OF COMPLETION

Certificate of Achievement

This is to certify that

${cert.student_name || "Unknown Student"}

has successfully completed the course

${cert.course_title || "Unknown Course"}

with outstanding performance and dedication.

Certificate ID: ${cert.certificate_id || "N/A"}
Student Email: ${cert.student_email || "N/A"}
Status: ${cert.status || "Unknown"}
Issued Date: ${new Date().toLocaleDateString()}

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
      a.download = `Certificate_${cert.certificate_id || "Unknown"}.txt`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to download certificate");
    }
  };

  return (
    <>
      <Header />
      <div style={container}>
        <div style={topSection}>
          <h1 style={title}>Issued Certificates</h1>
          <p style={subtitle}>
            View all certificates issued to students
          </p>
        </div>

        {/* Search Bar */}
        <div style={searchSection}>
          <input
            type="text"
            placeholder="Search by student name, email, course, or certificate ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInput}
          />
          <button onClick={fetchCertificates} style={refreshButton}>
            🔄 Refresh
          </button>
        </div>

        {/* Stats Section */}
        <div style={statsSection}>
          <div style={statCard}>
            <span style={statNumber}>{certificates.length}</span>
            <span style={statLabel}>Total Certificates</span>
          </div>
          <div style={statCard}>
            <span style={statNumber}>{filteredCertificates.length}</span>
            <span style={statLabel}>Search Results</span>
          </div>
        </div>

        {/* List Section */}
        <div style={listSection}>
          {loading ? (
            <div style={loaderContainer}>
              <div style={spinner}></div>
              <p>Loading certificates...</p>
            </div>
          ) : filteredCertificates.length === 0 ? (
            <div style={emptyState}>
              <p style={emptyText}>No certificates found</p>
            </div>
          ) : (
            <div style={cardGrid}>
              {filteredCertificates.map((cert, index) => (
                <div
                  key={cert.certificate_id || index}
                  style={{
                    ...card,
                    animation: `slideInUp 0.45s ease-out ${index * 0.06}s both`,
                  }}
                >
                  <div style={cardHeader}>
                    <span style={certificateId}>{cert.certificate_id}</span>
                    <span style={statusBadge}>{cert.status}</span>
                  </div>

                  <div style={cardBody}>
                    <div style={cardRow}>
                      <span style={cardLabel}>Student</span>
                      <span style={cardValue}>{cert.student_name}</span>
                    </div>
                    <div style={cardRow}>
                      <span style={cardLabel}>Email</span>
                      <span style={cardValue}>{cert.student_email}</span>
                    </div>
                    <div style={cardRow}>
                      <span style={cardLabel}>Course</span>
                      <span style={cardValue}>{cert.course_title}</span>
                    </div>
                  </div>

                  <div style={cardFooter}>
                    <button
                      onClick={() => handleViewDetails(cert)}
                      style={viewButton}
                    >
                      👁️ View
                    </button>
                    <button
                      onClick={() => handleDownload(cert)}
                      style={downloadButton}
                    >
                      ⬇️ Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal for Certificate Details */}
        {selectedCertificate && (
          <div style={modalOverlay} onClick={handleCloseModal}>
            <div
              style={modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={modalHeader}>
                <h2 style={modalTitle}>Certificate Details</h2>
                <button
                  onClick={handleCloseModal}
                  style={closeButton}
                >
                  ✕
                </button>
              </div>
              <div style={modalBody}>
                <div style={detailRow}>
                  <label style={detailLabel}>Certificate ID:</label>
                  <span style={detailValue}>{selectedCertificate.certificate_id}</span>
                </div>
                <div style={detailRow}>
                  <label style={detailLabel}>Student Name:</label>
                  <span style={detailValue}>{selectedCertificate.student_name}</span>
                </div>
                <div style={detailRow}>
                  <label style={detailLabel}>Email:</label>
                  <span style={detailValue}>{selectedCertificate.student_email}</span>
                </div>
                <div style={detailRow}>
                  <label style={detailLabel}>Course Title:</label>
                  <span style={detailValue}>{selectedCertificate.course_title}</span>
                </div>
                <div style={detailRow}>
                  <label style={detailLabel}>Status:</label>
                  <span style={detailValue}>{selectedCertificate.status}</span>
                </div>
              </div>
              <div style={modalFooter}>
                <button
                  onClick={() => {
                    handleDownload(selectedCertificate);
                    handleCloseModal();
                  }}
                  style={downloadButtonLarge}
                >
                  ⬇️ Download Certificate
                </button>
                <button
                  onClick={handleCloseModal}
                  style={closeButtonLarge}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Styles
const container = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #0f172a 0%, #312e81 45%, #4338ca 100%)",
  padding: "32px 20px 48px",
  fontFamily: "Inter, system-ui, sans-serif",
  color: "white",
};

const topSection = {
  maxWidth: "1200px",
  margin: "0 auto 28px auto",
  textAlign: "center",
};

const title = {
  margin: 0,
  fontSize: "3rem",
  color: "white",
  fontWeight: "800",
  letterSpacing: "-0.04em",
  lineHeight: "1.05",
};

const subtitle = {
  marginTop: "14px",
  color: "rgba(255,255,255,0.78)",
  fontSize: "1rem",
  maxWidth: "760px",
  marginLeft: "auto",
  marginRight: "auto",
  lineHeight: "1.8",
};

const searchSection = {
  maxWidth: "1200px",
  margin: "0 auto 26px auto",
  display: "flex",
  gap: "14px",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
};

const searchInput = {
  flex: 1,
  minWidth: "280px",
  padding: "14px 18px",
  fontSize: "15px",
  border: "1px solid rgba(255,255,255,0.16)",
  borderRadius: "18px",
  backgroundColor: "rgba(255,255,255,0.08)",
  color: "white",
  outline: "none",
  transition: "all 0.25s ease",
};

const refreshButton = {
  padding: "14px 24px",
  fontSize: "15px",
  background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
  color: "white",
  border: "none",
  borderRadius: "18px",
  cursor: "pointer",
  fontWeight: "700",
  boxShadow: "0 16px 32px rgba(99,102,241,0.2)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

const statsSection = {
  maxWidth: "1200px",
  margin: "0 auto 24px auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px",
};

const statCard = {
  background: "rgba(255,255,255,0.08)",
  padding: "22px",
  borderRadius: "24px",
  border: "1px solid rgba(255,255,255,0.14)",
  boxShadow: "0 20px 60px rgba(15,23,42,0.22)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const statNumber = {
  fontSize: "2.2rem",
  fontWeight: "800",
  color: "white",
};

const statLabel = {
  marginTop: "10px",
  fontSize: "0.95rem",
  color: "rgba(255,255,255,0.78)",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const listSection = {
  maxWidth: "1200px",
  margin: "0 auto",
  background: "rgba(15,23,42,0.92)",
  borderRadius: "30px",
  border: "1px solid rgba(255,255,255,0.14)",
  boxShadow: "0 30px 80px rgba(15,23,42,0.35)",
  overflow: "hidden",
  padding: "28px",
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "20px",
};

const card = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "24px",
  padding: "22px",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  boxShadow: "0 20px 50px rgba(15,23,42,0.18)",
};

const cardHeader = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
};

const cardBody = {
  display: "grid",
  gap: "10px",
};

const cardFooter = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  justifyContent: "flex-end",
  marginTop: "12px",
};

const cardRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "center",
};

const cardLabel = {
  color: "rgba(255,255,255,0.72)",
  fontSize: "0.9rem",
  fontWeight: "600",
};

const cardValue = {
  color: "white",
  fontSize: "0.96rem",
  fontWeight: "700",
  textAlign: "right",
};

const loaderContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "60px 20px",
};

const spinner = {
  width: "42px",
  height: "42px",
  border: "5px solid rgba(255,255,255,0.12)",
  borderTopColor: "#8b5cf6",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

const emptyState = {
  padding: "72px 20px",
  textAlign: "center",
};

const emptyText = {
  fontSize: "1.05rem",
  color: "rgba(255,255,255,0.72)",
  margin: 0,
};

const tableWrapper = {
  overflowX: "auto",
};

const table = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: "0",
};

const tableHeader = {
  background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(59,130,246,0.12))",
};

const th = {
  padding: "18px 20px",
  textAlign: "left",
  fontWeight: "700",
  color: "rgba(255,255,255,0.88)",
  fontSize: "0.95rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const tableRow = {
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  transition: "background-color 0.2s ease",
};

const td = {
  padding: "18px 20px",
  fontSize: "0.96rem",
  color: "rgba(255,255,255,0.9)",
  verticalAlign: "middle",
};

const certificateId = {
  backgroundColor: "rgba(99,102,241,0.2)",
  padding: "6px 10px",
  borderRadius: "999px",
  fontWeight: "700",
  color: "#eef2ff",
  fontFamily: "monospace",
  fontSize: "0.9rem",
};

const statusBadge = {
  backgroundColor: "rgba(16,185,129,0.18)",
  color: "#a7f3d0",
  padding: "7px 14px",
  borderRadius: "999px",
  fontSize: "0.85rem",
  fontWeight: "700",
};

const viewButton = {
  background: "rgba(59,130,246,0.18)",
  color: "#eff6ff",
  border: "1px solid rgba(59,130,246,0.35)",
  padding: "10px 14px",
  borderRadius: "999px",
  cursor: "pointer",
  fontSize: "0.9rem",
  marginRight: "8px",
};

const downloadButton = {
  background: "linear-gradient(135deg, #10b981, #5eead4)",
  color: "#0f172a",
  border: "none",
  padding: "10px 14px",
  borderRadius: "999px",
  cursor: "pointer",
  fontSize: "0.9rem",
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(15,23,42,0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  backdropFilter: "blur(5px)",
};

const modalContent = {
  backgroundColor: "rgba(15,23,42,0.98)",
  borderRadius: "28px",
  maxWidth: "520px",
  width: "92%",
  boxShadow: "0 30px 80px rgba(15,23,42,0.45)",
  overflow: "hidden",
  border: "1px solid rgba(255,255,255,0.12)",
};

const modalHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingBottom: "16px",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
  padding: "24px",
};

const modalTitle = {
  margin: 0,
  fontSize: "1.6rem",
  color: "white",
  fontWeight: "800",
};

const closeButton = {
  backgroundColor: "rgba(255,255,255,0.08)",
  border: "none",
  fontSize: "22px",
  color: "white",
  cursor: "pointer",
  padding: "10px",
  width: "40px",
  height: "40px",
  borderRadius: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalBody = {
  padding: "24px",
};

const detailRow = {
  marginBottom: "18px",
  display: "flex",
  flexDirection: "column",
};

const detailLabel = {
  fontWeight: "700",
  color: "rgba(255,255,255,0.84)",
  fontSize: "0.95rem",
  marginBottom: "8px",
};

const detailValue = {
  color: "rgba(255,255,255,0.92)",
  fontSize: "1rem",
  wordBreak: "break-word",
  lineHeight: "1.6",
};

const modalFooter = {
  display: "flex",
  gap: "12px",
  padding: "24px",
  borderTop: "1px solid rgba(255,255,255,0.1)",
  flexWrap: "wrap",
};

const downloadButtonLarge = {
  flex: 1,
  background: "linear-gradient(135deg, #10b981, #5eead4)",
  color: "#0f172a",
  border: "none",
  padding: "14px 16px",
  borderRadius: "16px",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: "700",
};

const closeButtonLarge = {
  flex: 1,
  backgroundColor: "rgba(255,255,255,0.08)",
  color: "white",
  border: "1px solid rgba(255,255,255,0.16)",
  padding: "14px 16px",
  borderRadius: "16px",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: "700",
};

export default IssuedCertificates;
