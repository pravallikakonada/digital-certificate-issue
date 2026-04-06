import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";

const API = "https://certificate-backend-mxjt.onrender.com/api/accounts/login/";

const StudentLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(API, {
        email: email.trim(),
        password: password.trim(),
      });

      localStorage.setItem("studentEmail", response.data.email);
      localStorage.setItem("studentName", response.data.name);
      localStorage.setItem("role", "student");

      navigate("/student-dashboard");
    } catch (error) {
      console.error("Student login error:", error?.response?.data || error);
      setError(error?.response?.data?.error || "Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div style={page}>
        <div style={container}>
          <div style={card}>
            <div style={cardHeader}>
              <div style={badge}>Student Access</div>
              <h1 style={heading}>Student Login</h1>
              <p style={description}>
                Sign in to manage your certificates, review course progress, and verify your completion records.
              </p>
            </div>

            <form onSubmit={handleLogin} style={form}>
              <div style={inputGroup}>
                <label style={label}>Email</label>
                <input
                  type="email"
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={input}
                />
              </div>

              <div style={inputGroup}>
                <label style={label}>Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={input}
                />
              </div>

              {error && <p style={errorText}>{error}</p>}

              <button type="submit" style={button} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div style={footerText}>
              <p>
                New here? <Link to="/student-signup" style={link}>Create a student account</Link>
              </p>
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const page = {
  minHeight: "100vh",
  background: "#eef4ff",
};

const container = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
};

const card = {
  width: "100%",
  maxWidth: "440px",
  background: "#ffffff",
  borderRadius: "20px",
  padding: "32px",
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
  border: "1px solid #e2e8f0",
};

const cardHeader = {
  marginBottom: "28px",
};

const badge = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#e0f2fe",
  color: "#0369a1",
  padding: "8px 14px",
  borderRadius: "999px",
  fontSize: "13px",
  fontWeight: "700",
  marginBottom: "16px",
};

const heading = {
  margin: "0 0 10px",
  fontSize: "28px",
  lineHeight: "1.1",
  color: "#0f172a",
};

const description = {
  margin: 0,
  color: "#475569",
  lineHeight: "1.7",
  fontSize: "15px",
};

const form = {
  display: "grid",
  gap: "18px",
};

const inputGroup = {
  display: "grid",
  gap: "8px",
};

const label = {
  fontSize: "14px",
  color: "#0f172a",
  fontWeight: "600",
};

const input = {
  width: "100%",
  minHeight: "48px",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  background: "#f8fafc",
  color: "#0f172a",
  outline: "none",
  fontSize: "15px",
  boxSizing: "border-box",
};

const button = {
  width: "100%",
  minHeight: "50px",
  borderRadius: "14px",
  border: "none",
  background: "#2563eb",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
};

const errorText = {
  margin: 0,
  color: "#dc2626",
  fontSize: "14px",
  fontWeight: "600",
};

const footerText = {
  marginTop: "24px",
  color: "#475569",
  fontSize: "14px",
  lineHeight: "1.8",
};

const link = {
  color: "#2563eb",
  fontWeight: "700",
  textDecoration: "none",
};

export default StudentLogin;
