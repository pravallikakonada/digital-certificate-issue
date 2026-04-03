import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />

      <div style={container}>
        <div style={card}>
          <h1 style={title}>Admin Dashboard</h1>
          <p style={subtitle}>
            Manage courses, send exams, and issue certificates.
          </p>

          <div style={buttonGrid}>
            <button style={btn} onClick={() => navigate("/manage-courses")}>
              Manage Courses
            </button>

            <button style={btn} onClick={() => navigate("/send-exam")}>
              Send Exam
            </button>

            <button style={btn} onClick={() => navigate("/completed-tests")}>
              Completed Tests
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const container = {
  minHeight: "100vh",
  background: "#eef4ff",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
};

const card = {
  width: "100%",
  maxWidth: "700px",
  background: "#fff",
  padding: "30px",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  textAlign: "center",
};

const title = {
  marginBottom: "10px",
  color: "#1e3a8a",
};

const subtitle = {
  marginBottom: "25px",
  color: "#555",
};

const buttonGrid = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const btn = {
  padding: "14px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "600",
};

export default AdminDashboard;