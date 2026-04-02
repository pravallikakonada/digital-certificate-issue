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
    <header
      style={{
        background: "#1e3a8a",
        color: "white",
        padding: "16px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <h2 style={{ margin: 0 }}>Digital Certificate System</h2>

      <nav
        style={{
          display: "flex",
          gap: "18px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {!email && (
          <>
            <Link to="/" style={linkStyle}>Home</Link>
            <Link to="/verify" style={linkStyle}>Verify</Link>
            <Link to="/admin-login" style={linkStyle}>Admin Login</Link>
            <Link to="/student-login" style={linkStyle}>Student Login</Link>
            
          </>
        )}

        {email && role === "admin" && (
          <>
            <Link to="/admin-dashboard" style={linkStyle}>Admin Dashboard</Link>
            <Link to="/send-exam-mail" style={linkStyle}>Send Exam</Link>
            <Link to="/completed-tests" style={linkStyle}>Completed Tests</Link>
            
          </>
        )}

        {email && role === "student" && (
          <>
            <Link to="/student-dashboard" style={linkStyle}>Student Dashboard</Link>
            <Link to="/my-certificates" style={linkStyle}>My Certificates</Link>
            <Link to="/verify" style={linkStyle}>Verify</Link>
          </>
        )}

        {email && (
          <>
            <span style={{ fontSize: "14px" }}>{email}</span>
            <button onClick={handleLogout} style={logoutBtn}>
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "500",
};

const logoutBtn = {
  background: "white",
  color: "#1e3a8a",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

export default Header;