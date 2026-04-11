import React, { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import api from "../services/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { QRCodeCanvas as QRCode } from "qrcode.react";

const MyCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const certificateRef = useRef(null);

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

  const formatDate = (dateValue) => {
    if (!dateValue) return new Date().toLocaleDateString();
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? dateValue : date.toLocaleDateString();
  };

  const handleDownload = async (cert) => {
    if (!cert) {
      alert("Certificate data is not available");
      return;
    }

    if (!certificateRef.current) {
      alert("Certificate element not found");
      return;
    }

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");

      const pageWidth = 297;
      const pageHeight = 210;

      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
      pdf.save(`Certificate_${cert.certificate_id || "Unknown"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate certificate PDF");
    }
  };

  const handleViewCertificate = (cert) => {
    if (!cert) {
      alert("Certificate data is not available");
      return;
    }
    setSelectedCertificate(cert);
    setViewMode("certificate");
  };

  const handleBackToGrid = () => {
    setSelectedCertificate(null);
    setViewMode("grid");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCertificateId = async (certificateId) => {
    try {
      await navigator.clipboard.writeText(certificateId || "");
      alert("Certificate ID copied successfully");
    } catch (error) {
      alert("Failed to copy Certificate ID");
    }
  };

  const getVerificationUrl = (cert) => {
    return `${window.location.origin}/verify/${cert?.certificate_id || ""}`;
  };

  const getTemplateStyle = (template) => {
    if (template === "modern") return certificateDesignModern;
    if (template === "elegant") return certificateDesignElegant;
    return certificateDesign;
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes floatSeal {
            0% { transform: scale(1); opacity: 0.10; }
            50% { transform: scale(1.04); opacity: 0.16; }
            100% { transform: scale(1); opacity: 0.10; }
          }

          @media print {
            body * {
              visibility: hidden;
            }
            .print-area, .print-area * {
              visibility: visible;
            }
            .print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 0;
            }
            .hide-print {
              display: none !important;
            }
          }
        `}
      </style>

      <Header />

      <div style={container}>
        <div style={content}>
          {viewMode === "certificate" && selectedCertificate ? (
            <>
              <div style={certificateHeader} className="hide-print">
                <button style={backBtn} onClick={handleBackToGrid}>
                  ← Back
                </button>
                <h1 style={pageTitle}>My Certificate</h1>
              </div>

              <div className="print-area">
                <div
                  ref={certificateRef}
                  style={{
                    ...getTemplateStyle(selectedCertificate.template),
                    ...certificateWrapper,
                  }}
                >
                  <div style={topLeftShape}></div>
                  <div style={bottomRightShape}></div>
                  <div style={certificateBorder}></div>

                  <div style={watermarkSeal}>CERTIFIED</div>

                  <div style={certHeader}>
                    <div style={headerDecoration}>
                      <div style={decorationLine}></div>
                      <div style={decorationCircle}></div>
                      <div style={decorationLine}></div>
                    </div>

                    <h1 style={certTitle}>Certificate of Achievement</h1>
                    <p style={certSubtitle}>This certificate is proudly presented to</p>
                  </div>

                  <div style={certBody}>
                    <h2 style={studentName}>
                      {selectedCertificate.student_name || "Student Name"}
                    </h2>

                    <p style={certText}>
                      for successfully completing the course
                    </p>

                    <h3 style={certCourseName}>
                      {selectedCertificate.course_title || "Course Title"}
                    </h3>

                    <p style={certDescription}>
                      This certificate recognizes the candidate&apos;s successful completion,
                      dedication, and performance in the learning process.
                    </p>
                  </div>

                  <div style={detailsGrid}>
                    <div style={detailCard}>
                      <p style={detailCardLabel}>Certificate ID</p>
                      <p style={detailCardValue}>
                        {selectedCertificate.certificate_id || "N/A"}
                      </p>
                    </div>

                    <div style={detailCard}>
                      <p style={detailCardLabel}>Student Email</p>
                      <p style={detailCardValue}>
                        {selectedCertificate.student_email || "N/A"}
                      </p>
                    </div>

                    <div style={detailCard}>
                      <p style={detailCardLabel}>Issue Date</p>
                      <p style={detailCardValue}>
                        {formatDate(
                          selectedCertificate.issue_date ||
                            selectedCertificate.issued_at
                        )}
                      </p>
                    </div>

                    <div style={detailCard}>
                      <p style={detailCardLabel}>Completion Date</p>
                      <p style={detailCardValue}>
                        {formatDate(
                          selectedCertificate.completion_date ||
                            selectedCertificate.completed_at
                        )}
                      </p>
                    </div>

                    <div style={detailCard}>
                      <p style={detailCardLabel}>Grade</p>
                      <p style={detailCardValue}>
                        {selectedCertificate.grade || "A"}
                      </p>
                    </div>

                    <div style={detailCard}>
                      <p style={detailCardLabel}>Score</p>
                      <p style={detailCardValue}>
                        {selectedCertificate.score || "Qualified"}
                      </p>
                    </div>
                  </div>

                  <div style={middleSection}>
                    <div style={qrSection}>
                      <div style={qrCodeBox}>
                        <QRCode
                          value={getVerificationUrl(selectedCertificate)}
                          size={95}
                          level="H"
                          includeMargin={true}
                        />
                      </div>
                      <div style={qrTextWrap}>
                        <p style={qrLabel}>Scan to Verify</p>
                        <p style={qrDescription}>
                          Verify this certificate using the QR code or certificate ID.
                        </p>
                        <p style={verifyLinkText}>
                          {getVerificationUrl(selectedCertificate)}
                        </p>
                      </div>
                    </div>

                    <div style={statusBadgeBox}>
                      <div style={statusCircle}>
                        <span style={statusCircleText}>
                          {selectedCertificate.status || "VALID"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={signatureSection}>
                    <div style={signatureBox}>
                      <div style={signatureLine}></div>
                      <p style={signatureText}>Authorized Signature</p>
                      <p style={signatureName}>
                        {selectedCertificate.issued_by || "Admin Officer"}
                      </p>
                      <p style={signatureTitle}>Digital Certificate System</p>
                    </div>

                    <div style={signatureBox}>
                      <div style={signatureLine}></div>
                      <p style={signatureText}>Course / Examination</p>
                      <p style={signatureName}>
                        {selectedCertificate.course_title || "Course Department"}
                      </p>
                      <p style={signatureTitle}>Academic Validation</p>
                    </div>
                  </div>

                  <div style={certFooter}>
                    <p style={footerText}>
                      This certificate is digitally generated and valid for official verification.
                    </p>
                  </div>
                </div>
              </div>

              <div style={certificateActions} className="hide-print">
                <button
                  style={actionBtnPrimary}
                  onClick={() => handleDownload(selectedCertificate)}
                >
                  Download PDF
                </button>

                <button style={actionBtnSecondary} onClick={handlePrint}>
                  Print
                </button>

                <button
                  style={actionBtnDark}
                  onClick={() =>
                    handleCopyCertificateId(selectedCertificate.certificate_id)
                  }
                >
                  Copy Certificate ID
                </button>
              </div>
            </>
          ) : (
            <>
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
                  <p>You have not received any certificates yet.</p>
                </div>
              ) : (
                <div style={certificatesGrid}>
                  {certificates.map((cert) => (
                    <div
                      key={cert.certificate_id || cert.id}
                      style={{
                        ...certificateCard,
                        boxShadow:
                          hoveredCard === (cert.certificate_id || cert.id)
                            ? "0 16px 30px rgba(15, 23, 42, 0.15)"
                            : certificateCard.boxShadow,
                        transform:
                          hoveredCard === (cert.certificate_id || cert.id)
                            ? "translateY(-4px)"
                            : "translateY(0px)",
                      }}
                      onMouseEnter={() =>
                        setHoveredCard(cert.certificate_id || cert.id)
                      }
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div style={cardTopAccent}></div>

                      <div style={cardHeader}>
                        <div>
                          <h3 style={cardCourseTitle}>
                            {cert.course_title || "Unknown Course"}
                          </h3>
                          <p style={cardSubText}>
                            {cert.student_name || "Unknown Student"}
                          </p>
                        </div>

                        <span style={statusBadge}>
                          {cert.status || "Issued"}
                        </span>
                      </div>

                      <div style={cardBody}>
                        <div style={infoRow}>
                          <span style={label}>Certificate ID</span>
                          <span style={value}>
                            {cert.certificate_id || "N/A"}
                          </span>
                        </div>

                        <div style={infoRow}>
                          <span style={label}>Student Email</span>
                          <span style={value}>
                            {cert.student_email || "N/A"}
                          </span>
                        </div>

                        <div style={infoRow}>
                          <span style={label}>Issue Date</span>
                          <span style={value}>
                            {formatDate(cert.issue_date || cert.issued_at)}
                          </span>
                        </div>

                        <div style={infoRow}>
                          <span style={label}>Grade</span>
                          <span style={value}>{cert.grade || "A"}</span>
                        </div>
                      </div>

                      <div style={cardFooter}>
                        <button
                          style={viewBtn}
                          onClick={() => handleViewCertificate(cert)}
                        >
                          View Certificate
                        </button>
                        <button
                          style={downloadBtn}
                          onClick={() => {
                            handleViewCertificate(cert);
                            setTimeout(() => handleDownload(cert), 300);
                          }}
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

const container = {
  minHeight: "100vh",
  width: "100%",
  padding: "32px 18px",
  background: "linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%)",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  boxSizing: "border-box",
};

const content = {
  width: "min(1300px, 100%)",
  display: "grid",
  gap: "24px",
};

const title = {
  margin: "0 0 8px",
  fontSize: "34px",
  color: "#0f172a",
  textAlign: "center",
  fontWeight: "700",
};

const pageTitle = {
  margin: 0,
  fontSize: "30px",
  color: "#0f172a",
  fontWeight: "700",
};

const loadingContainer = {
  textAlign: "center",
  padding: "60px 20px",
  background: "white",
  borderRadius: "20px",
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
};

const spinner = {
  width: "40px",
  height: "40px",
  border: "4px solid #e2e8f0",
  borderTop: "4px solid #2563eb",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  margin: "0 auto 20px",
};

const emptyState = {
  textAlign: "center",
  padding: "60px 20px",
  background: "white",
  borderRadius: "20px",
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
};

const certificatesGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
  gap: "22px",
};

const certificateCard = {
  background: "#ffffff",
  borderRadius: "20px",
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
  overflow: "hidden",
  transition: "all 0.25s ease",
  border: "1px solid #e2e8f0",
};

const cardTopAccent = {
  height: "6px",
  background: "linear-gradient(90deg, #1d4ed8, #3b82f6, #0ea5e9)",
};

const cardHeader = {
  padding: "20px 20px 0 20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
};

const cardCourseTitle = {
  margin: 0,
  fontSize: "19px",
  color: "#0f172a",
  fontWeight: "700",
  lineHeight: 1.3,
};

const cardSubText = {
  margin: "6px 0 0 0",
  color: "#64748b",
  fontSize: "14px",
};

const statusBadge = {
  padding: "7px 12px",
  borderRadius: "999px",
  background: "#dcfce7",
  color: "#166534",
  fontSize: "12px",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "0.4px",
  whiteSpace: "nowrap",
};

const cardBody = {
  padding: "18px 20px",
};

const infoRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px",
  gap: "12px",
};

const label = {
  fontWeight: "600",
  color: "#64748b",
  fontSize: "14px",
};

const value = {
  fontWeight: "600",
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
  padding: "12px 16px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "14px",
};

const downloadBtn = {
  flex: 1,
  padding: "12px 16px",
  background: "#10b981",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "14px",
};

const certificateHeader = {
  display: "flex",
  alignItems: "center",
  gap: "18px",
  marginBottom: "10px",
};

const backBtn = {
  padding: "10px 18px",
  background: "#475569",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "14px",
};

const certificateWrapper = {
  width: "100%",
  minHeight: "720px",
  overflow: "hidden",
};

const certificateDesign = {
  position: "relative",
  background: "#f8fbff",
  borderRadius: "24px",
  padding: "46px",
  border: "1px solid #dbeafe",
  boxShadow: "0 15px 40px rgba(30, 64, 175, 0.08)",
};

const certificateDesignModern = {
  position: "relative",
  background: "linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)",
  borderRadius: "24px",
  padding: "46px",
  border: "1px solid #cbd5e1",
  boxShadow: "0 15px 40px rgba(15, 23, 42, 0.12)",
};

const certificateDesignElegant = {
  position: "relative",
  background: "linear-gradient(135deg, #fffdf6 0%, #fff7ed 100%)",
  borderRadius: "24px",
  padding: "46px",
  border: "1px solid #fed7aa",
  boxShadow: "0 15px 40px rgba(180, 83, 9, 0.12)",
};

const topLeftShape = {
  position: "absolute",
  top: "-40px",
  left: "-40px",
  width: "220px",
  height: "220px",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(37,99,235,0.20), rgba(37,99,235,0.02))",
};

const bottomRightShape = {
  position: "absolute",
  bottom: "-60px",
  right: "-60px",
  width: "260px",
  height: "260px",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(14,165,233,0.18), rgba(14,165,233,0.02))",
};

const certificateBorder = {
  position: "absolute",
  top: "22px",
  left: "22px",
  right: "22px",
  bottom: "22px",
  border: "2px solid rgba(148, 163, 184, 0.35)",
  borderRadius: "18px",
  pointerEvents: "none",
};

const watermarkSeal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%) rotate(-22deg)",
  fontSize: "72px",
  fontWeight: "800",
  letterSpacing: "6px",
  color: "#1d4ed8",
  opacity: 0.1,
  animation: "floatSeal 4s ease-in-out infinite",
  pointerEvents: "none",
};

const certHeader = {
  textAlign: "center",
  marginBottom: "26px",
  position: "relative",
  zIndex: 2,
};

const headerDecoration = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "18px",
  gap: "18px",
};

const decorationLine = {
  height: "2px",
  width: "100px",
  background: "linear-gradient(90deg, #60a5fa, #1d4ed8)",
  borderRadius: "999px",
};

const decorationCircle = {
  width: "14px",
  height: "14px",
  borderRadius: "50%",
  background: "#1d4ed8",
  boxShadow: "0 0 0 6px rgba(37, 99, 235, 0.12)",
};

const certTitle = {
  margin: "0 0 8px 0",
  fontSize: "44px",
  color: "#0f172a",
  fontWeight: "800",
  letterSpacing: "1px",
  textTransform: "uppercase",
};

const certSubtitle = {
  margin: 0,
  fontSize: "18px",
  color: "#475569",
  letterSpacing: "0.5px",
};

const certBody = {
  textAlign: "center",
  marginBottom: "28px",
  position: "relative",
  zIndex: 2,
};

const studentName = {
  margin: "18px 0 14px 0",
  fontSize: "40px",
  color: "#111827",
  fontWeight: "700",
  fontFamily: "Georgia, serif",
};

const certCourseName = {
  margin: "14px 0",
  fontSize: "27px",
  color: "#1d4ed8",
  fontWeight: "700",
};

const certText = {
  margin: "10px 0",
  fontSize: "18px",
  color: "#334155",
  lineHeight: 1.6,
};

const certDescription = {
  margin: "12px auto 0",
  maxWidth: "720px",
  fontSize: "15px",
  color: "#64748b",
  lineHeight: 1.7,
};

const detailsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "14px",
  marginBottom: "28px",
  position: "relative",
  zIndex: 2,
};

const detailCard = {
  background: "rgba(255,255,255,0.85)",
  border: "1px solid #e2e8f0",
  borderRadius: "14px",
  padding: "14px 16px",
  boxShadow: "0 4px 10px rgba(15, 23, 42, 0.04)",
};

const detailCardLabel = {
  margin: "0 0 6px 0",
  fontSize: "12px",
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.8px",
  fontWeight: "700",
};

const detailCardValue = {
  margin: 0,
  fontSize: "15px",
  color: "#0f172a",
  fontWeight: "700",
  wordBreak: "break-word",
};

const middleSection = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  marginBottom: "30px",
  position: "relative",
  zIndex: 2,
};

const qrSection = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  gap: "16px",
  background: "rgba(255,255,255,0.88)",
  border: "1px solid #e2e8f0",
  borderRadius: "16px",
  padding: "16px",
};

const qrCodeBox = {
  background: "#ffffff",
  borderRadius: "12px",
  padding: "10px",
  border: "1px solid #e2e8f0",
};

const qrTextWrap = {
  flex: 1,
};

const qrLabel = {
  margin: "0 0 8px 0",
  fontSize: "16px",
  color: "#0f172a",
  fontWeight: "700",
};

const qrDescription = {
  margin: "0 0 8px 0",
  fontSize: "14px",
  color: "#475569",
  lineHeight: 1.5,
};

const verifyLinkText = {
  margin: 0,
  fontSize: "12px",
  color: "#1d4ed8",
  wordBreak: "break-all",
};

const statusBadgeBox = {
  width: "170px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const statusCircle = {
  width: "130px",
  height: "130px",
  borderRadius: "50%",
  border: "5px solid #16a34a",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "radial-gradient(circle, #ecfdf5 0%, #dcfce7 100%)",
  boxShadow: "0 8px 20px rgba(22, 163, 74, 0.18)",
};

const statusCircleText = {
  color: "#166534",
  fontWeight: "800",
  fontSize: "18px",
  textTransform: "uppercase",
  letterSpacing: "1px",
  textAlign: "center",
};

const signatureSection = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: "30px",
  marginBottom: "20px",
  position: "relative",
  zIndex: 2,
};

const signatureBox = {
  flex: 1,
  textAlign: "center",
};

const signatureLine = {
  width: "210px",
  height: "2px",
  background: "#0f172a",
  margin: "0 auto 8px",
};

const signatureText = {
  margin: "4px 0",
  fontSize: "13px",
  color: "#64748b",
  fontWeight: "600",
};

const signatureName = {
  margin: "4px 0",
  fontSize: "17px",
  color: "#0f172a",
  fontWeight: "700",
};

const signatureTitle = {
  margin: "4px 0",
  fontSize: "12px",
  color: "#64748b",
};

const certFooter = {
  textAlign: "center",
  paddingTop: "14px",
  borderTop: "1px solid rgba(148, 163, 184, 0.35)",
  position: "relative",
  zIndex: 2,
};

const footerText = {
  margin: 0,
  fontSize: "13px",
  color: "#475569",
  letterSpacing: "0.3px",
};

const certificateActions = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "14px",
};

const actionBtnPrimary = {
  padding: "12px 20px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "14px",
};

const actionBtnSecondary = {
  padding: "12px 20px",
  background: "#10b981",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "14px",
};

const actionBtnDark = {
  padding: "12px 20px",
  background: "#0f172a",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "14px",
};

export default MyCertificates;