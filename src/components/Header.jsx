import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const email =
    localStorage.getItem("email") || localStorage.getItem("studentEmail");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("studentEmail");
    localStorage.removeItem("studentName");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <header style={headerStyle}>
      <div style={headerContainer}>
        <div style={logoSection}>
          <div style={logoIcon}>🎓</div>
          <div style={logoText}>
            <h1 style={mainTitle}>Digital Certificate System</h1>
            <p style={subtitle}>Secure & Verified Certifications</p>
          </div>
        </div>

        <nav style={navStyle}>
          {!email && (
            <>
              <Link to="/" style={navLink}>Home</Link>
              <Link to="/verify" style={navLink}>Verify Certificate</Link>
              <Link to="/admin-login" style={primaryBtn}>Admin Login</Link>
              <Link to="/student-login" style={secondaryBtn}>Student Login</Link>
            </>
          )}

          {email && role === "admin" && (
            <>
              <Link to="/admin-dashboard" style={navLink}>Dashboard</Link>
              <Link to="/manage-courses" style={navLink}>Manage Courses</Link>
              <Link to="/send-exam" style={navLink}>Send Exam</Link>
              <Link to="/completed-tests" style={navLink}>Completed Tests</Link>
            </>
          )}

          {email && role === "student" && (
            <>
              <Link to="/student-dashboard" style={navLink}>Dashboard</Link>
              <Link to="/my-certificates" style={navLink}>My Certificates</Link>
              <Link to="/verify" style={navLink}>Verify</Link>
            </>
          )}

          {email && (
            <>
              <div style={userInfo}>
                <span style={userEmail}>{email}</span>
                <span style={userRole}>
                  {role === "admin" ? "Admin" : "Student"}
                </span>
              </div>
              <button onClick={handleLogout} style={logoutBtn}>
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

const headerStyle = {
  background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
  color: "white",
  padding: "0",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  position: "sticky",
  top: 0,
  zIndex: 1000,
};

const headerContainer = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "16px 30px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "20px",
};

const logoSection = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const logoIcon = {
  fontSize: "32px",
  background: "rgba(255, 255, 255, 0.2)",
  borderRadius: "12px",
  padding: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const logoText = {
  display: "flex",
  flexDirection: "column",
};

const mainTitle = {
  margin: "0",
  fontSize: "20px",
  fontWeight: "700",
  color: "white",
  lineHeight: "1.2",
};

const subtitle = {
  margin: "2px 0 0",
  fontSize: "12px",
  color: "rgba(255, 255, 255, 0.8)",
  fontWeight: "400",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const navStyle = {
  display: "flex",
  gap: "16px",
  alignItems: "center",
  flexWrap: "wrap",
};

const navLink = {
  color: "white",
  textDecoration: "none",
  fontWeight: "500",
  fontSize: "14px",
  padding: "8px 12px",
  borderRadius: "6px",
  transition: "all 0.2s ease",
  ":hover": {
    background: "rgba(255, 255, 255, 0.1)",
  },
};

const primaryBtn = {
  background: "white",
  color: "#1e3a8a",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "14px",
  padding: "10px 16px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  transition: "all 0.2s ease",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const secondaryBtn = {
  background: "rgba(255, 255, 255, 0.1)",
  color: "white",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "14px",
  padding: "10px 16px",
  borderRadius: "8px",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  cursor: "pointer",
  transition: "all 0.2s ease",
  ":hover": {
    background: "rgba(255, 255, 255, 0.2)",
  },
};

const userInfo = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  marginRight: "12px",
  padding: "8px 12px",
  background: "rgba(255, 255, 255, 0.1)",
  borderRadius: "8px",
};

const userEmail = {
  fontSize: "13px",
  fontWeight: "600",
  color: "white",
};

const userRole = {
  fontSize: "11px",
  color: "rgba(255, 255, 255, 0.7)",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  fontWeight: "500",
};

const logoutBtn = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "13px",
  transition: "all 0.2s ease",
  ":hover": {
    background: "#b91c1c",
  },
};

export default Header;