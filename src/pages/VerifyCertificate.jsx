import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import { verifyCertificate } from "../services/certificateService.js";

const VerifyCertificate = () => {
  const [certificateId, setCertificateId] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get("id");

    if (idFromUrl) {
      setCertificateId(idFromUrl);
      handleVerifyById(idFromUrl);
    }
  }, []);

  const handleVerifyById = async (id) => {
    try {
      const data = await verifyCertificate(id);
      setCertificate(data);
      setError("");
    } catch (err) {
      console.error(err);
      setCertificate(null);
      setError("Invalid Certificate ❌");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    handleVerifyById(certificateId);
  };

  return (
    <>
      <Header />

      <div
        style={{
          minHeight: "100vh",
          padding: "30px",
          background: "#f3f4f6",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            background: "white",
            padding: "30px",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ marginTop: 0, color: "#1e3a8a" }}>Verify Certificate</h2>

          <form onSubmit={handleVerify} style={{ marginTop: "20px" }}>
            <input
              type="text"
              placeholder="Enter Certificate ID"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "14px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "16px",
              }}
            />

            <button
              type="submit"
              style={{
                padding: "12px 18px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Verify
            </button>
          </form>

          {error && (
            <p style={{ color: "red", marginTop: "20px", fontSize: "18px" }}>
              {error}
            </p>
          )}

          {certificate && (
            <div
              style={{
                marginTop: "25px",
                background: "#f9fafb",
                padding: "22px",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
              }}
            >
              <p><b>Name:</b> {certificate.student_name}</p>
              <p><b>Email:</b> {certificate.student_email}</p>
              <p><b>Course:</b> {certificate.course_title}</p>
              <p><b>Certificate ID:</b> {certificate.certificate_id}</p>
              <p><b>Status:</b> {certificate.status}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VerifyCertificate;