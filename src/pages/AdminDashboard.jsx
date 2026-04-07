import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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

      <div style={container}>
        <div style={topSection}>
          <h1 style={title}>Admin Dashboard</h1>
          <p style={subtitle}>
            Manage courses, send exams, check completed tests, and issue certificates.
          </p>
        </div>

        <div style={grid}>
          <Link to="/manage-courses" style={card}>
            <div style={icon}>📘</div>
            <h3 style={cardTitle}>Manage Courses</h3>
            <p style={cardText}>Add, edit, and organize course details.</p>
          </Link>

          <Link to="/send-exam" style={card}>
            <div style={icon}>📩</div>
            <h3 style={cardTitle}>Send Exam</h3>
            <p style={cardText}>Send exam links to students by email.</p>
          </Link>

          <Link to="/completed-tests" style={card}>
            <div style={icon}>✅</div>
            <h3 style={cardTitle}>Completed Tests</h3>
            <p style={cardText}>Review student test results and eligibility.</p>
          </Link>

          <Link to="/issue" style={card}>
            <div style={icon}>🏆</div>
            <h3 style={cardTitle}>Issue Certificate</h3>
            <p style={cardText}>Generate and issue certificates to students.</p>
          </Link>

          <Link to="/issued-certificates" style={card}>
            <div style={icon}>📋</div>
            <h3 style={cardTitle}>View Issued Certificates</h3>
            <p style={cardText}>View all certificates issued to students.</p>
          </Link>

          <Link to="/verify" style={card}>
            <div style={icon}>🔍</div>
            <h3 style={cardTitle}>Verify Certificate</h3>
            <p style={cardText}>Verify certificate details using certificate ID.</p>
          </Link>

          <Link to="/email-config" style={card}>
            <div style={icon}>⚙️</div>
            <h3 style={cardTitle}>Email Configuration</h3>
            <p style={cardText}>Test and configure email settings.</p>
          </Link>
        </div>
      </div>
    </>
  );
};

const container = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #eef4ff, #dbeafe)",
  padding: "35px 20px",
  fontFamily: "Arial, sans-serif",
};

const topSection = {
  maxWidth: "1100px",
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

const grid = {
  maxWidth: "1100px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "22px",
};

const card = {
  background: "#ffffff",
  textDecoration: "none",
  padding: "28px 24px",
  borderRadius: "18px",
  boxShadow: "0 12px 28px rgba(30, 58, 138, 0.12)",
  border: "1px solid #dbeafe",
  transition: "0.3s",
  display: "block",
};

const icon = {
  fontSize: "34px",
  marginBottom: "14px",
};

const cardTitle = {
  margin: "0 0 10px 0",
  color: "#1e3a8a",
  fontSize: "22px",
};

const cardText = {
  margin: 0,
  color: "#475569",
  fontSize: "15px",
  lineHeight: "1.6",
};

export default AdminDashboard;
