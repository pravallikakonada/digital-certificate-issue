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

      localStorage.setItem("studentEmail", response.data.email);
      localStorage.setItem("studentName", response.data.name);
      localStorage.setItem("role", "student");

      alert("Login successful ");
      navigate("/student-dashboard");
    } catch (error) {
      console.error("Student login error:", error?.response?.data || error);

      if (error?.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert("Login failed ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div style={page}>
        <div style={overlay}>
          <div style={wrapper}>
            <div style={leftSection}>
              <div style={brandBadge}>Student Portal</div>
              <h1 style={mainHeading}>Digital Certificate Issue & Verification System</h1>
              <p style={subText}>
                Securely login to access your dashboard, view certificates,
                verify certificate status, and track your course completion details.
              </p>

              <div style={featureBox}>
                <div style={featureItem}>✅ Secure Student Login</div>
                <div style={featureItem}>📜 View Issued Certificates</div>
                <div style={featureItem}>🔍 Certificate Verification</div>
                <div style={featureItem}>� Track Course Completion</div>
              </div>
            </div>

            <div style={rightSection}>
              <div style={card}>
                <div style={iconCircle}>🎓</div>
                <h2 style={title}>Student Login</h2>
                <p style={subtitle}>Login to access your certificate dashboard</p>

                <form onSubmit={handleLogin}>
                  <div style={inputGroup}>
                    <label style={label}>Student Email</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={input}
                    />
                  </div>

                  <div style={inputGroup}>
                    <label style={label}>Password</label>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={input}
                    />
                  </div>

                  <button type="submit" style={btn} disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </form>

                <div style={footerText}>
                  <span>Need certificate verification? </span>
                  <Link to="/verify" style={link}>
                    Verify Here
                  </Link>
                </div>

                <div style={bottomNote}>
                  Your credentials are protected and used only for secure student access.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const page = {
  minHeight: "100vh",
  background:
    "linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #334155 100%)",
};

const overlay = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px 20px",
};

const wrapper = {
  width: "100%",
  maxWidth: "1200px",
  display: "grid",
  gridTemplateColumns: "1.1fr 0.9fr",
  gap: "30px",
  alignItems: "center",
};

const leftSection = {
  padding: "20px 10px",
};

const brandBadge = {
  display: "inline-block",
  background: "#334155",
  color: "#f1f5f9",
  padding: "8px 16px",
  borderRadius: "999px",
  fontWeight: "700",
  fontSize: "14px",
  marginBottom: "18px",
  border: "1px solid #475569",
};

const mainHeading = {
  fontSize: "44px",
  lineHeight: "1.2",
  color: "#f1f5f9",
  margin: "0 0 16px 0",
  fontWeight: "800",
};

const subText = {
  fontSize: "17px",
  color: "#cbd5e1",
  lineHeight: "1.8",
  maxWidth: "620px",
  marginBottom: "26px",
};

const featureBox = {
  background: "#1e293b",
  border: "1px solid #334155",
  borderRadius: "20px",
  padding: "22px",
  boxShadow: "0 12px 30px rgba(0, 0, 0, 0.3)",
  maxWidth: "520px",
};

const featureItem = {
  fontSize: "16px",
  color: "#e2e8f0",
  marginBottom: "14px",
  fontWeight: "600",
};

const rightSection = {
  display: "flex",
  justifyContent: "center",
};

const card = {
  width: "100%",
  maxWidth: "430px",
  background: "#1e293b",
  borderRadius: "24px",
  padding: "34px 30px",
  boxShadow: "0 18px 45px rgba(0, 0, 0, 0.4)",
  border: "1px solid #334155",
  position: "relative",
};

const iconCircle = {
  width: "72px",
  height: "72px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #334155, #475569)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "32px",
  margin: "0 auto 18px auto",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
};

const title = {
  textAlign: "center",
  color: "#f1f5f9",
  margin: "0 0 8px 0",
  fontSize: "30px",
  fontWeight: "800",
};

const subtitle = {
  textAlign: "center",
  color: "#94a3b8",
  marginBottom: "24px",
  fontSize: "15px",
};

const inputGroup = {
  marginBottom: "16px",
};

const label = {
  display: "block",
  marginBottom: "8px",
  color: "#e2e8f0",
  fontWeight: "700",
  fontSize: "14px",
};

const input = {
  width: "100%",
  padding: "14px 15px",
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
  background: "linear-gradient(135deg, #334155, #475569)",
  color: "#f1f5f9",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "16px",
  marginTop: "8px",
  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
};

const footerText = {
  textAlign: "center",
  marginTop: "20px",
  fontSize: "14px",
  color: "#cbd5e1",
};

const link = {
  color: "#60a5fa",
  fontWeight: "700",
  textDecoration: "none",
};

const bottomNote = {
  marginTop: "18px",
  textAlign: "center",
  fontSize: "13px",
  color: "#94a3b8",
  lineHeight: "1.6",
};

export default StudentLogin;