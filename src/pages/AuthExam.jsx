import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE = "https://certificate-backend-mxjt.onrender.com";

const AuthExam = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const emailFromLink = params.get("email") || "";
  const nameFromLink = params.get("name") || "";
  const course = params.get("course") || "";

  const [isSignup, setIsSignup] = useState(true);
  const [name, setName] = useState(nameFromLink);
  const [email, setEmail] = useState(emailFromLink);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const goToTest = () => {
    navigate(
      `/take-test?name=${encodeURIComponent(name)}&email=${encodeURIComponent(
        email
      )}&course=${encodeURIComponent(course)}`
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      if (isSignup) {
        if (!name.trim()) {
          setError("Please enter your name");
          setLoading(false);
          return;
        }

        if (!confirmPassword.trim()) {
          setError("Please confirm password");
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        try {
          await axios.post(`${API_BASE}/api/accounts/signup/`, {
            name: name.trim(),
            email: email.trim(),
            password: password.trim(),
          });
        } catch (signupErr) {
          const msg = signupErr?.response?.data?.error || "";
          if (!msg.toLowerCase().includes("already exists")) {
            setError(msg || "Signup failed ❌");
            setLoading(false);
            return;
          }
        }
      }

      const loginResponse = await axios.post(`${API_BASE}/api/accounts/login/`, {
        email: email.trim(),
        password: password.trim(),
      });

      localStorage.setItem("studentEmail", loginResponse.data.email || email);
      localStorage.setItem("studentName", loginResponse.data.name || name);
      localStorage.setItem("role", "student");

      alert(isSignup ? "Signup/Login successful " : "Login successful ");
      goToTest();
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        (isSignup ? "Signup/Login failed ❌" : "Login failed ❌");

      setError(msg);
      console.error("AuthExam error:", err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={{ color: "#1e3a8a", marginTop: 0 }}>
          {isSignup ? "Signup to Start Exam" : "Login to Start Exam"}
        </h2>

        <p style={{ color: "#555", marginBottom: "18px" }}>
          <b>Course:</b> {course}
        </p>

        <form onSubmit={handleSubmit}>
          {isSignup ? (
            <>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
              />

              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />

              <input
                type="password"
                placeholder="Create Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={inputStyle}
              />
            </>
          ) : (
            <>
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
            </>
          )}

          {error && (
            <p style={{ color: "red", marginTop: "6px", marginBottom: "12px" }}>
              {error}
            </p>
          )}

          <button type="submit" style={btnStyle} disabled={loading}>
            {loading
              ? "Please wait..."
              : isSignup
              ? "Signup & Start Exam"
              : "Login & Start Exam"}
          </button>
        </form>

        <p style={{ marginTop: "18px" }}>
          {isSignup ? "Already have an account? " : "New user? "}
          <span
            onClick={() => {
              setError("");
              setPassword("");
              setConfirmPassword("");
              setIsSignup(!isSignup);
            }}
            style={{ color: "#2563eb", cursor: "pointer", fontWeight: "600" }}
          >
            {isSignup ? "Login here" : "Signup here"}
          </span>
        </p>
      </div>
    </div>
  );
};

const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#eef4ff",
  padding: "20px",
  fontFamily: "Arial, sans-serif",
};

const card = {
  width: "100%",
  maxWidth: "420px",
  background: "#fff",
  padding: "28px",
  borderRadius: "18px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
  fontSize: "15px",
};

const btnStyle = {
  width: "100%",
  padding: "12px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "15px",
};

export default AuthExam;