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
    <>
      <style>
        {`
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          a:hover { text-decoration: none; }
        `}
      </style>
      <header style={headerStyle}>
        <div style={headerContainer}>
          <Link to="/" style={logoLink}>
            <div style={logoSection}>
              <div style={logoIcon}>🎓</div>
              <div style={logoText}>
                <h1 style={mainTitle}>Digital Certificates</h1>
                <p style={subtitle}>Secure & Verified</p>
              </div>
            </div>
          </Link>

          <nav style={navStyle}>
            {!email && (
              <>
                <Link to="/" style={navLink}>Home</Link>
                <Link to="/verify" style={navLink}>Verify</Link>
                <Link to="/admin-login" style={primaryBtn}>Admin</Link>
                <Link to="/student-login" style={secondaryBtn}>Student</Link>
              </>
            )}

            {email && role === "admin" && (
              <>
                <Link to="/admin-dashboard" style={navLink}>Dashboard</Link>
                <Link to="/manage-courses" style={navLink}>Courses</Link>
                <Link to="/send-exam" style={navLink}>Send Exam</Link>
                <Link to="/completed-tests" style={navLink}>Tests</Link>
              </>
            )}

            {email && role === "student" && (
              <>
                <Link to="/student-dashboard" style={navLink}>Dashboard</Link>
                <Link to="/my-certificates" style={navLink}>Certificates</Link>
                <Link to="/verify" style={navLink}>Verify</Link>
              </>
            )}

            {email && (
              <>
                <div style={userInfo}>
                  <span style={userEmail}>{email}</span>
                  <span style={userRole}>{role === "admin" ? "👨‍💼 Admin" : "👨‍🎓 Student"}</span>
                </div>
                <button onClick={handleLogout} style={logoutBtn}>
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </header>
    </>
  );
};

const headerStyle = {
  background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
  color: "white",
  padding: "0",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
  position: "sticky",
  top: 0,
  zIndex: 1000,
  animation: "slideDown 0.5s ease-out",
};

const headerContainer = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "14px 30px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "24px",
};

const logoLink = {
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
};

const logoSection = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const logoIcon = {
  fontSize: "28px",
  background: "rgba(255, 255, 255, 0.2)",
  borderRadius: "10px",
  padding: "6px 8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backdropFilter: "blur(10px)",
};

const logoText = {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
};

const mainTitle = {
  margin: "0",
  fontSize: "16px",
  fontWeight: "700",
  color: "white",
  lineHeight: "1.2",
  letterSpacing: "-0.3px",
};

const subtitle = {
  margin: "0",
  fontSize: "11px",
  color: "rgba(255, 255, 255, 0.8)",
  fontWeight: "500",
  textTransform: "uppercase",
  letterSpacing: "0.4px",
};

const navStyle = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
  flexWrap: "wrap",
};

const navLink = {
  color: "white",
  textDecoration: "none",
  fontWeight: "500",
  fontSize: "13px",
  padding: "8px 14px",
  borderRadius: "6px",
  transition: "all 0.2s ease",
  display: "inline-block",
  background: "transparent",
};

const primaryBtn = {
  background: "white",
  color: "#1e3a8a",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "13px",
  padding: "8px 16px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  transition: "all 0.2s ease",
  boxShadow: "0 4px 12px rgba(255, 255, 255, 0.25)",
  display: "inline-block",
};

const secondaryBtn = {
  background: "rgba(255, 255, 255, 0.15)",
  color: "white",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "13px",
  padding: "8px 16px",
  borderRadius: "6px",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  cursor: "pointer",
  transition: "all 0.2s ease",
  display: "inline-block",
  backdropFilter: "blur(10px)",
};

const userInfo = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: "2px",
  marginRight: "8px",
  padding: "8px 12px",
  background: "rgba(255, 255, 255, 0.1)",
  borderRadius: "6px",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
};

const userEmail = {
  fontSize: "12px",
  fontWeight: "600",
  color: "white",
};

const userRole = {
  fontSize: "10px",
  color: "rgba(255, 255, 255, 0.8)",
  fontWeight: "600",
  letterSpacing: "0.3px",
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
  boxShadow: "0 4px 12px rgba(220, 38, 38, 0.3)",
};

export default Header;