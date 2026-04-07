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
            <div style={tableWrapper}>
              <table style={table}>
                <thead>
                  <tr style={tableHeader}>
                    <th style={th}>Certificate ID</th>
                    <th style={th}>Student Name</th>
                    <th style={th}>Email</th>
                    <th style={th}>Course Title</th>
                    <th style={th}>Status</th>
                    <th style={th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCertificates.map((cert, index) => (
                    <tr
                      key={index}
                      style={{
                        ...tableRow,
                        backgroundColor: index % 2 === 0 ? "#f8f9fa" : "#ffffff",
                      }}
                    >
                      <td style={td}>
                        <span style={certificateId}>{cert.certificate_id}</span>
                      </td>
                      <td style={td}>{cert.student_name}</td>
                      <td style={td}>{cert.student_email}</td>
                      <td style={td}>{cert.course_title}</td>
                      <td style={td}>
                        <span style={statusBadge}>{cert.status}</span>
                      </td>
                      <td style={td}>
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
  background: "linear-gradient(135deg, #eef4ff, #dbeafe)",
  padding: "35px 20px",
  fontFamily: "Arial, sans-serif",
};

const topSection = {
  maxWidth: "1200px",
  margin: "0 auto 30px auto",
  textAlign: "center",
};

const title = {
  margin: 0,
  fontSize: "38px",
  color: "#1e3a8a",
  fontWeight: "700",
};

const subtitle = {
  marginTop: "10px",
  color: "#475569",
  fontSize: "17px",
};

const searchSection = {
  maxWidth: "1200px",
  margin: "0 auto 25px auto",
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const searchInput = {
  flex: 1,
  minWidth: "250px",
  padding: "12px 15px",
  fontSize: "15px",
  border: "2px solid #e2e8f0",
  borderRadius: "8px",
  backgroundColor: "#ffffff",
  outline: "none",
  transition: "border-color 0.3s",
};

const refreshButton = {
  padding: "12px 24px",
  fontSize: "15px",
  backgroundColor: "#3b82f6",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  transition: "background-color 0.3s",
};

const statsSection = {
  maxWidth: "1200px",
  margin: "0 auto 25px auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "15px",
};

const statCard = {
  backgroundColor: "#ffffff",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const statNumber = {
  fontSize: "28px",
  fontWeight: "700",
  color: "#1e3a8a",
};

const statLabel = {
  marginTop: "8px",
  fontSize: "14px",
  color: "#64748b",
};

const listSection = {
  maxWidth: "1200px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: "10px",
  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
  overflow: "hidden",
};

const loaderContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "60px 20px",
};

const spinner = {
  width: "40px",
  height: "40px",
  border: "4px solid #e2e8f0",
  borderTopColor: "#3b82f6",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

const emptyState = {
  padding: "60px 20px",
  textAlign: "center",
};

const emptyText = {
  fontSize: "18px",
  color: "#64748b",
  margin: 0,
};

const tableWrapper = {
  overflowX: "auto",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const tableHeader = {
  backgroundColor: "#f8fafc",
  borderBottom: "2px solid #e2e8f0",
};

const th = {
  padding: "16px",
  textAlign: "left",
  fontWeight: "600",
  color: "#1e3a8a",
  fontSize: "15px",
};

const tableRow = {
  borderBottom: "1px solid #e2e8f0",
  transition: "background-color 0.2s",
};

const td = {
  padding: "16px",
  fontSize: "14px",
  color: "#334155",
};

const certificateId = {
  backgroundColor: "#dbeafe",
  padding: "4px 8px",
  borderRadius: "4px",
  fontWeight: "600",
  color: "#1e3a8a",
  fontFamily: "monospace",
};

const statusBadge = {
  backgroundColor: "#dcfce7",
  color: "#166534",
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "600",
};

const viewButton = {
  backgroundColor: "#3b82f6",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "13px",
  marginRight: "8px",
  transition: "background-color 0.3s",
};

const downloadButton = {
  backgroundColor: "#10b981",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "13px",
  transition: "background-color 0.3s",
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalContent = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  maxWidth: "500px",
  width: "90%",
  boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
  overflow: "hidden",
};

const modalHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingBottom: "16px",
  borderBottom: "1px solid #e2e8f0",
  padding: "20px",
};

const modalTitle = {
  margin: 0,
  fontSize: "22px",
  color: "#1e3a8a",
  fontWeight: "700",
};

const closeButton = {
  backgroundColor: "transparent",
  border: "none",
  fontSize: "24px",
  color: "#64748b",
  cursor: "pointer",
  padding: 0,
  width: "30px",
  height: "30px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalBody = {
  padding: "20px",
};

const detailRow = {
  marginBottom: "16px",
  display: "flex",
  flexDirection: "column",
};

const detailLabel = {
  fontWeight: "600",
  color: "#1e3a8a",
  fontSize: "14px",
  marginBottom: "6px",
};

const detailValue = {
  color: "#334155",
  fontSize: "15px",
  wordBreak: "break-word",
};

const modalFooter = {
  display: "flex",
  gap: "10px",
  padding: "20px",
  borderTop: "1px solid #e2e8f0",
};

const downloadButtonLarge = {
  flex: 1,
  backgroundColor: "#10b981",
  color: "white",
  border: "none",
  padding: "12px 16px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "600",
  transition: "background-color 0.3s",
};

const closeButtonLarge = {
  flex: 1,
  backgroundColor: "#e2e8f0",
  color: "#1e3a8a",
  border: "none",
  padding: "12px 16px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "600",
  transition: "background-color 0.3s",
};

export default IssuedCertificates;
