import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const API = "https://certificate-backend-mxjt.onrender.com/api/accounts/admin-login/";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      navigate("/admin-dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(API, {
        email: email.trim(),
        password: password.trim(),
      });

      localStorage.setItem("email", response.data.email || email);
      localStorage.setItem("role", "admin");

      alert("Admin login successful ✅");
      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Admin login error:", error?.response?.data || error);
      if (error?.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert("Invalid admin email or password ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div style={container}>
        <div style={leftSection}>
          <div style={badge}>ADMIN ACCESS</div>
          <h1 style={title}>Welcome Back, Admin</h1>
          <p style={subtitle}>
            Login to manage courses, send exams, review completed tests, and issue certificates.
          </p>

          <div style={infoBox}>
            <div style={infoCard}>
              <span style={infoIcon}>📘</span>
              <p style={infoText}>Manage Courses</p>
            </div>
            <div style={infoCard}>
              <span style={infoIcon}>📩</span>
              <p style={infoText}>Send Exams</p>
            </div>
            <div style={infoCard}>
              <span style={infoIcon}>🏆</span>
              <p style={infoText}>Issue Certificates</p>
            </div>
          </div>
        </div>

        <div style={rightSection}>
          <div style={card}>
            <h2 style={cardTitle}>Admin Login</h2>
            <p style={cardSubtitle}>Enter your credentials to continue</p>

            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={input}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={input}
              />

              <button type="submit" style={btn} disabled={loading}>
                {loading ? "Logging in..." : "Login as Admin"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

const container = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #334155 100%)",
  display: "grid",
  gridTemplateColumns: "1.2fr 1fr",
  gap: "20px",
  alignItems: "center",
  padding: "30px",
  fontFamily: "Arial, sans-serif",
};

const leftSection = {
  padding: "20px 30px",
};

const badge = {
  display: "inline-block",
  background: "#334155",
  color: "#f1f5f9",
  padding: "8px 14px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "1px",
  marginBottom: "18px",
  border: "1px solid #475569",
};

const title = {
  fontSize: "42px",
  color: "#f1f5f9",
  margin: "0 0 12px 0",
  lineHeight: "1.2",
};

const subtitle = {
  color: "#cbd5e1",
  fontSize: "17px",
  maxWidth: "560px",
  lineHeight: "1.7",
};

const infoBox = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "16px",
  marginTop: "28px",
  maxWidth: "600px",
};

const infoCard = {
  background: "#1e293b",
  borderRadius: "18px",
  padding: "18px",
  boxShadow: "0 8px 22px rgba(0, 0, 0, 0.3)",
  textAlign: "center",
  border: "1px solid #334155",
};

const infoIcon = {
  fontSize: "28px",
  display: "block",
  marginBottom: "10px",
};

const infoText = {
  margin: 0,
  fontWeight: "600",
  color: "#e2e8f0",
};

const rightSection = {
  display: "flex",
  justifyContent: "center",
};

const card = {
  width: "100%",
  maxWidth: "430px",
  background: "#1e293b",
  padding: "32px",
  borderRadius: "24px",
  boxShadow: "0 18px 40px rgba(0, 0, 0, 0.4)",
  border: "1px solid #334155",
};

const cardTitle = {
  margin: "0 0 8px 0",
  color: "#f1f5f9",
  fontSize: "30px",
};

const cardSubtitle = {
  margin: "0 0 22px 0",
  color: "#94a3b8",
  fontSize: "15px",
};

const input = {
  width: "100%",
  padding: "14px",
  marginBottom: "14px",
  borderRadius: "12px",
  border: "1px solid #475569",
  boxSizing: "border-box",
  fontSize: "15px",
  outline: "none",
  background: "#334155",
  color: "#f1f5f9",
};

const btn = {
  width: "100%",
  padding: "14px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "700",
};

export default AdminLogin;