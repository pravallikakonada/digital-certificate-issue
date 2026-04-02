import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const StudentDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "student") {
      navigate("/student-login");
    }
  }, [navigate]);

  return (
    <>
      <Header />

      <div
        style={{
          minHeight: "100vh",
          background: "#eef4ff",
          padding: "30px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            background: "#fff",
            borderRadius: "20px",
            padding: "35px",
            boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
          }}
        >
          <h1 style={{ color: "#1e3a8a", marginTop: 0 }}>Student Dashboard</h1>
          <p style={{ color: "#4b5563", fontSize: "18px" }}>
            Welcome to student portal. You can view your certificates and verify certificate details here.
          </p>

          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              marginTop: "25px",
            }}
          >
            <a href="/my-certificates" style={btnPrimary}>My Certificates</a>
            <a href="/verify" style={btnSecondary}>Verify Certificate</a>
          </div>
        </div>
      </div>
    </>
  );
};

const btnPrimary = {
  background: "#2563eb",
  color: "white",
  textDecoration: "none",
  padding: "12px 22px",
  borderRadius: "10px",
  fontWeight: "600",
};

const btnSecondary = {
  background: "#e5e7eb",
  color: "#111827",
  textDecoration: "none",
  padding: "12px 22px",
  borderRadius: "10px",
  fontWeight: "600",
};

export default StudentDashboard;