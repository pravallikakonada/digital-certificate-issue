import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API_BASE_URL = "https://certificate-backend-mxjt.onrender.com";

const StudentLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${API_BASE_URL}/api/accounts/login/`, {
        email,
        password,
      });

      localStorage.setItem("email", response.data.email);
      localStorage.setItem("studentEmail", response.data.email);
      localStorage.setItem("studentName", response.data.name || "");
      localStorage.setItem("role", "student");

      alert("Student login successful ✅");
      navigate("/student-dashboard");
    } catch (err) {
      console.error("Student login error:", err?.response?.data || err);
      setError(err?.response?.data?.error || "Student login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={{ color: "#1e3a8a" }}>Student Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Student Email"
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

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit" style={btnStyle} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ marginTop: "15px" }}>
          New student? <Link to="/student-signup">Signup here</Link>
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

export default StudentLogin;