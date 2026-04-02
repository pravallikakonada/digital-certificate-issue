import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://10.20.1.126:8000";

const MyCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail =
      localStorage.getItem("email") || localStorage.getItem("studentEmail");

    // ✅ login lekunte login page ki pampali
    if (!userEmail) {
      navigate("/login");
      return;
    }

    axios
      .get(`${API_BASE_URL}/api/certificates/`)
      .then((res) => {
        console.log("All certificates:", res.data);

        const userCertificates = res.data.filter(
          (cert) => cert.student_email === userEmail
        );

        setCertificates(userCertificates);
      })
      .catch((err) => {
        console.error("Error fetching certificates:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

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
        <h1
          style={{
            textAlign: "center",
            color: "#1e3a8a",
            fontSize: "48px",
            marginBottom: "30px",
          }}
        >
          My Certificates
        </h1>

        {loading ? (
          <p style={{ textAlign: "center", fontSize: "20px" }}>No Certificate Found..</p>
        ) : certificates.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              fontSize: "22px",
              color: "#444",
            }}
          >
            No certificates found
          </p>
        ) : (
          certificates.map((cert, index) => (
            <div
              key={index}
              style={{
                width: "100%",
                maxWidth: "950px",
                margin: "0 auto 40px auto",
                background: "linear-gradient(135deg, #fffdf7, #fffaf0)",
                border: "10px solid #d4af37",
                borderRadius: "24px",
                padding: "40px 50px",
                boxShadow: "0 20px 45px rgba(0,0,0,0.12)",
                position: "relative",
                overflow: "hidden",
                fontFamily: "'Georgia', serif",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "14px",
                  left: "14px",
                  width: "90px",
                  height: "90px",
                  borderTop: "6px solid #1e3a8a",
                  borderLeft: "6px solid #1e3a8a",
                  borderRadius: "18px 0 0 0",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "14px",
                  width: "90px",
                  height: "90px",
                  borderTop: "6px solid #1e3a8a",
                  borderRight: "6px solid #1e3a8a",
                  borderRadius: "0 18px 0 0",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "14px",
                  left: "14px",
                  width: "90px",
                  height: "90px",
                  borderBottom: "6px solid #1e3a8a",
                  borderLeft: "6px solid #1e3a8a",
                  borderRadius: "0 0 0 18px",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "14px",
                  right: "14px",
                  width: "90px",
                  height: "90px",
                  borderBottom: "6px solid #1e3a8a",
                  borderRight: "6px solid #1e3a8a",
                  borderRadius: "0 0 18px 0",
                }}
              />

              <div style={{ textAlign: "center", marginBottom: "25px" }}>
                <h1
                  style={{
                    margin: 0,
                    fontSize: "42px",
                    color: "#1e3a8a",
                    fontWeight: "700",
                    letterSpacing: "1px",
                  }}
                >
                  Digital Certificate
                </h1>
                <p
                  style={{
                    marginTop: "8px",
                    fontSize: "20px",
                    color: "#b8860b",
                    fontWeight: "600",
                    letterSpacing: "1px",
                  }}
                >
                  Certificate of Completion
                </p>
              </div>

              <div style={{ textAlign: "center", marginTop: "25px" }}>
                <p
                  style={{
                    fontSize: "20px",
                    color: "#555",
                    marginBottom: "10px",
                  }}
                >
                  This is proudly presented to
                </p>

                <h2
                  style={{
                    margin: "10px auto 20px auto",
                    fontSize: "38px",
                    color: "#111827",
                    borderBottom: "3px solid #d4af37",
                    display: "inline-block",
                    paddingBottom: "10px",
                    minWidth: "320px",
                  }}
                >
                  {cert.student_name}
                </h2>

                <p
                  style={{
                    fontSize: "18px",
                    color: "#374151",
                    lineHeight: "1.8",
                    maxWidth: "700px",
                    margin: "0 auto 25px auto",
                  }}
                >
                  for successfully completing the course
                  <span style={{ fontWeight: "700", color: "#1e3a8a" }}>
                    {" "}
                    {cert.course_title}
                  </span>{" "}
                  and meeting the academic requirements of the Digital
                  Certificate System.
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "18px",
                  marginTop: "25px",
                  background: "rgba(255,255,255,0.7)",
                  padding: "20px",
                  borderRadius: "16px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <p style={detailText}>
                  <b>Student Email:</b> {cert.student_email}
                </p>
                <p style={detailText}>
                  <b>Issue Date:</b> {cert.issue_date || "2026-04-01"}
                </p>
                <p style={detailText}>
                  <b>Certificate ID:</b> {cert.certificate_id}
                </p>
                <p style={detailText}>
                  <b>Status:</b> {cert.status}
                </p>
              </div>

              <div
                style={{
                  marginTop: "40px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "end",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    background: "#eff6ff",
                    color: "#1e3a8a",
                    padding: "12px 18px",
                    borderRadius: "12px",
                    fontWeight: "700",
                    fontSize: "14px",
                    border: "1px solid #bfdbfe",
                  }}
                >
                  Verified Digital Record
                </div>

                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: "180px",
                      borderTop: "2px solid #111827",
                      marginBottom: "8px",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#444",
                      fontWeight: "600",
                    }}
                  >
                    Authorized Signature
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

const detailText = {
  margin: 0,
  fontSize: "16px",
  color: "#374151",
};

export default MyCertificates;