import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API_BASE_URL = "https://certificate-backend-mxjt.onrender.com";

const StudentSignup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and Confirm Password must be same");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_BASE_URL}/api/accounts/signup/`,
        {
          name,
          email,
          password,
        }
      );

      localStorage.setItem("email", response.data.email);
      localStorage.setItem("studentEmail", response.data.email);
      localStorage.setItem("studentName", response.data.name || name);
      localStorage.setItem("role", "student");

      alert("Student signup successful ✅");
      navigate("/student-dashboard");
    } catch (err) {
      console.error("Signup error:", err?.response?.data || err);

      if (err?.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Signup failed ❌");
      }
    } finally {
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
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
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
              <div style={brandIcon}>🎓</div>
              <h1 style={brandTitle}>Digital Certificates</h1>
              <p style={brandSubtitle}>Your Achievement, Digitally Verified</p>
            </div>

            <div style={featuresSection}>
              <div style={featureItem}>
                <div style={featureIcon}>✨</div>
                <div>
                  <h3 style={featureTitle}>Instant Certificates</h3>
                  <p style={featureDesc}>Earn certificates upon course completion</p>
                </div>
              </div>

              <div style={featureItem}>
                <div style={featureIcon}>🔐</div>
                <div>
                  <h3 style={featureTitle}>Secure & Verified</h3>
                  <p style={featureDesc}>QR code verification for authenticity</p>
                </div>
              </div>

              <div style={featureItem}>
                <div style={featureIcon}>📱</div>
                <div>
                  <h3 style={featureTitle}>Easy Access</h3>
                  <p style={featureDesc}>View and download your certificates anytime</p>
                </div>
              </div>

              <div style={featureItem}>
                <div style={featureIcon}>🌍</div>
                <div>
                  <h3 style={featureTitle}>Globally Recognized</h3>
                  <p style={featureDesc}>Share your achievements with confidence</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div style={rightSection}>
            <div style={formCard}>
              <div style={formHeader}>
                <h2 style={formTitle}>Create Your Account</h2>
                <p style={formSubtitle}>Join our learning community today</p>
              </div>

              <form onSubmit={handleSignup} style={form}>
                {/* Name Input */}
                <div style={inputWrapper}>
                  <label style={label}>Full Name</label>
                  <div style={{
                    ...inputContainer,
                    borderColor: focusedField === 'name' ? '#3b82f6' : '#e5e7eb',
                    boxShadow: focusedField === 'name' ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none'
                  }}>
                    <span style={inputIcon}>👤</span>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      style={inputField}
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div style={inputWrapper}>
                  <label style={label}>Email Address</label>
                  <div style={{
                    ...inputContainer,
                    borderColor: focusedField === 'email' ? '#3b82f6' : '#e5e7eb',
                    boxShadow: focusedField === 'email' ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none'
                  }}>
                    <span style={inputIcon}>✉️</span>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
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
                    <span style={inputIcon}>🔒</span>
                    <input
                      type="password"
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      style={inputField}
                    />
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div style={inputWrapper}>
                  <label style={label}>Confirm Password</label>
                  <div style={{
                    ...inputContainer,
                    borderColor: focusedField === 'confirmPassword' ? '#3b82f6' : '#e5e7eb',
                    boxShadow: focusedField === 'confirmPassword' ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none'
                  }}>
                    <span style={inputIcon}>🔐</span>
                    <input
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField(null)}
                      style={inputField}
                    />
                  </div>
                </div>

                {error && (
                  <div style={errorBox}>
                    <span style={errorIcon}>⚠️</span>
                    <span style={errorText}>{error}</span>
                  </div>
                )}

                <button type="submit" style={{...btnStyle, opacity: loading ? 0.7 : 1}} disabled={loading}>
                  <span style={{marginRight: '8px'}}>
                    {loading ? '⏳' : '✓'}
                  </span>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <div style={divider}>
                <span>Already have an account?</span>
              </div>

              <Link to="/student-login" style={loginLink}>
                Sign In Here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const container = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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

const errorBox = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "12px 16px",
  borderRadius: "12px",
  background: "#fee2e2",
  border: "1px solid #fecaca",
  color: "#991b1b",
};

const errorIcon = {
  fontSize: "18px",
};

const errorText = {
  fontSize: "14px",
  fontWeight: "500",
};

const btnStyle = {
  width: "100%",
  padding: "14px 16px",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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

const divider = {
  textAlign: "center",
  fontSize: "14px",
  color: "#64748b",
  marginTop: "20px",
};

const loginLink = {
  display: "block",
  textAlign: "center",
  color: "#667eea",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "600",
  padding: "12px 0",
  borderRadius: "8px",
  transition: "all 0.3s ease",
  background: "rgba(102, 126, 234, 0.1)",
};

// Responsive adjustments
const responsiveWrapper = {
  ...wrapper,
  gridTemplateColumns: window.innerWidth <= 768 ? "1fr" : "1fr 1fr",
};

export default StudentSignup;