import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

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
      <style>
        {`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          a:hover {
            transform: translateY(-4px);
          }
        `}
      </style>
      <div style={container}>
        <div style={topSection}>
          <div style={headerBadge}>👨‍💼 Admin Panel</div>
          <h1 style={title}>Welcome Back, Admin</h1>
          <p style={subtitle}>
            Manage courses, send exams, review test submissions, and issue certificates
          </p>
        </div>

        <div style={grid}>
          <Link to="/manage-courses" style={card}>
            <div style={icon}>📘</div>
            <h3 style={cardTitle}>Manage Courses</h3>
            <p style={cardText}>Add, edit, and organize course details.</p>
          </Link>

          <Link to="/manage-questions" style={card}>
            <div style={icon}>❓</div>
            <h3 style={cardTitle}>Manage Questions</h3>
            <p style={cardText}>Add, edit, and manage exam questions for courses.</p>
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

         
        </div>
      </div>
    </>
  );
};

const container = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)",
  padding: "60px 20px",
  fontFamily: "Arial, sans-serif",
};

const topSection = {
  maxWidth: "1100px",
  margin: "0 auto 60px auto",
  textAlign: "center",
  animation: "slideInUp 0.8s ease-out",
};

const headerBadge = {
  display: "inline-block",
  background: "rgba(255, 255, 255, 0.2)",
  backdropFilter: "blur(10px)",
  color: "white",
  padding: "8px 16px",
  borderRadius: "50px",
  fontSize: "14px",
  fontWeight: "600",
  marginBottom: "16px",
  border: "1px solid rgba(255, 255, 255, 0.3)",
};

const title = {
  margin: 0,
  fontSize: "48px",
  color: "white",
  fontWeight: "800",
  marginBottom: "12px",
  letterSpacing: "-0.5px",
};

const subtitle = {
  marginTop: 0,
  marginBottom: 0,
  color: "rgba(255, 255, 255, 0.85)",
  fontSize: "16px",
  lineHeight: "1.6",
  maxWidth: "700px",
  marginLeft: "auto",
  marginRight: "auto",
};

const grid = {
  maxWidth: "1100px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "24px",
};

const card = {
  background: "white",
  textDecoration: "none",
  padding: "32px 28px",
  borderRadius: "16px",
  boxShadow: "0 16px 40px rgba(0, 0, 0, 0.15)",
  border: "1px solid #f3f4f6",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  display: "block",
  position: "relative",
  overflow: "hidden",
  animation: "slideInUp 0.6s ease-out both",
};

const icon = {
  fontSize: "42px",
  marginBottom: "16px",
  display: "inline-block",
};

const cardTitle = {
  margin: "0 0 8px 0",
  color: "#1f2937",
  fontSize: "18px",
  fontWeight: "700",
};

const cardText = {
  margin: 0,
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "1.6",
};

export default AdminDashboard;
