import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:8000";

const StudentSignup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div style={container}>
      <div style={card}>
        <h2 style={{ color: "#1e3a8a" }}>Student Signup</h2>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />

          <input
            type="email"
            placeholder="Student Email"
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

          {error && <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>}

          <button type="submit" style={btnStyle} disabled={loading}>
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>

        <p style={{ marginTop: "15px" }}>
          Already have account? <Link to="/student-login">Login here</Link>
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
};

const card = {
  width: "100%",
  maxWidth: "420px",
  background: "#fff",
  padding: "30px",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
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
};

export default StudentSignup;