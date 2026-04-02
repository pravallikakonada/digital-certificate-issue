import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/admin-login");
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
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          <h1 style={{ color: "#1e3a8a" }}>Admin Dashboard</h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
              marginTop: "25px",
            }}
          >
            <a href="/send-exam-mail" style={cardStyle}>Send Exam Mail</a>
            <a href="/completed-tests" style={cardStyle}>Completed Tests</a>
            <a href="/upload-csv" style={cardStyle}>Upload CSV</a>
            <a href="/issue" style={cardStyle}>Issue Certificate</a>
            <a href="/manage-courses" style={cardStyle}>Manage Courses</a>
            <a href="/verify" style={cardStyle}>Verify Certificate</a>
          </div>
        </div>
      </div>
    </>
  );
};

const cardStyle = {
  background: "#2563eb",
  color: "white",
  textDecoration: "none",
  padding: "28px",
  borderRadius: "16px",
  fontWeight: "600",
  textAlign: "center",
  boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
};

export default AdminDashboard;