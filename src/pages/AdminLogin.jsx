import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://certificate-backend-mxjt.onrender.com/api/accounts/admin-login/";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

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

      alert("Admin login successful ");
      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Admin login error:", error?.response?.data || error?.message || error);
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        "Invalid admin email or password ❌";
      alert(errorMessage);
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          input:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
        `}
      </style>
      <div style={container}>
        <div style={responsiveWrapper}>
          {/* Left Section */}
          <div style={leftSection}>
            <div style={brandSection}>
              <div style={brandIcon}>👨‍💼</div>
              <h1 style={brandTitle}>Admin Portal</h1>
              <p style={brandSubtitle}>Manage Your Certificate System</p>
            </div>

            <div style={featuresSection}>
              <div style={featureItem}>
                <div style={featureIcon}>📚</div>
                <div>
                  <h3 style={featureTitle}>Manage Courses</h3>
                  <p style={featureDesc}>Create and manage course offerings</p>
                </div>
              </div>

              <div style={featureItem}>
                <div style={featureIcon}>📧</div>
                <div>
                  <h3 style={featureTitle}>Send Exams</h3>
                  <p style={featureDesc}>Distribute exams to students</p>
                </div>
              </div>

              <div style={featureItem}>
                <div style={featureIcon}></div>
                <div>
                  <h3 style={featureTitle}>Review Submissions</h3>
                  <p style={featureDesc}>Check completed test submissions</p>
                </div>
              </div>

              <div style={featureItem}>
                <div style={featureIcon}>🏅</div>
                <div>
                  <h3 style={featureTitle}>Issue Certificates</h3>
                  <p style={featureDesc}>Award digital certificates to students</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div style={rightSection}>
            <div style={formCard}>
              <div style={formHeader}>
                <h2 style={formTitle}>Admin Sign In</h2>
                <p style={formSubtitle}>Enter your admin credentials</p>
                <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "8px" }}>
                  Demo admin: admin@gmail.com / admin123
                </p>
              </div>

              <form onSubmit={handleLogin} style={form}>
                {/* Email Input */}
                <div style={inputWrapper}>
                  <label style={label}>Email Address</label>
                  <div style={{
                    ...inputContainer,
                    borderColor: focusedField === 'email' ? '#3b82f6' : '#e5e7eb',
                    boxShadow: focusedField === 'email' ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none'
                  }}>
                    <span style={inputIcon}>💼</span>
                    <input
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      style={inputField}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div style={inputWrapper}>
                  <label style={label}>Password</label>
                  <div style={{
                    ...inputContainer,
                    borderColor: focusedField === 'password' ? '#3b82f6' : '#e5e7eb',
                    boxShadow: focusedField === 'password' ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none'
                  }}>
                    <span style={inputIcon}>🔐</span>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      style={inputField}
                    />
                  </div>
                </div>

                <button type="submit" style={{...btnStyle, opacity: loading ? 0.7 : 1}} disabled={loading}>
                  <span style={{marginRight: '8px'}}>
                    {loading ? '⏳' : '🔓'}
                  </span>
                  {loading ? 'Signing In...' : 'Access Admin Panel'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const container = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
};

const wrapper = {
  width: "100%",
  maxWidth: "1200px",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "40px",
  alignItems: "center",
};

const leftSection = {
  color: "white",
  animation: "slideInLeft 0.8s ease-out",
  display: window.innerWidth <= 768 ? "none" : "block",
};

const brandSection = {
  marginBottom: "50px",
};

const brandIcon = {
  fontSize: "60px",
  marginBottom: "20px",
};

const brandTitle = {
  fontSize: "42px",
  fontWeight: "700",
  margin: "0 0 10px 0",
  lineHeight: "1.2",
};

const brandSubtitle = {
  fontSize: "18px",
  opacity: 0.9,
  margin: 0,
  fontWeight: "300",
};

const featuresSection = {
  display: "grid",
  gap: "24px",
};

const featureItem = {
  display: "flex",
  gap: "16px",
  alignItems: "flex-start",
};

const featureIcon = {
  fontSize: "28px",
  minWidth: "40px",
  marginTop: "4px",
};

const featureTitle = {
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 4px 0",
  color: "white",
};

const featureDesc = {
  fontSize: "14px",
  opacity: 0.85,
  margin: 0,
};

const rightSection = {
  animation: "slideInRight 0.8s ease-out",
};

const formCard = {
  background: "white",
  borderRadius: "20px",
  padding: window.innerWidth <= 768 ? "30px 20px" : "40px",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
};

const formHeader = {
  marginBottom: "30px",
  textAlign: "center",
};

const formTitle = {
  fontSize: window.innerWidth <= 768 ? "24px" : "28px",
  fontWeight: "700",
  color: "#0f172a",
  margin: "0 0 8px 0",
};

const formSubtitle = {
  fontSize: "14px",
  color: "#64748b",
  margin: 0,
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const inputWrapper = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const label = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#0f172a",
};

const inputContainer = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px 16px",
  border: "2px solid #e5e7eb",
  borderRadius: "12px",
  transition: "all 0.3s ease",
  backgroundColor: "#f8fafc",
};

const inputIcon = {
  fontSize: "18px",
  minWidth: "20px",
};

const inputField = {
  flex: 1,
  border: "none",
  background: "transparent",
  fontSize: "14px",
  color: "#0f172a",
  fontFamily: "inherit",
  padding: 0,
};

const btnStyle = {
  width: "100%",
  padding: "14px 16px",
  background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "16px",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

// Responsive adjustments
const responsiveWrapper = {
  ...wrapper,
  gridTemplateColumns: window.innerWidth <= 768 ? "1fr" : "1fr 1fr",
};

export default AdminLogin;