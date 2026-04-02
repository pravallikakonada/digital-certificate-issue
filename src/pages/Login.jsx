import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";

const API_BASE_URL = "http://192.168.29.45:8000";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${API_BASE_URL}/api/accounts/login/`, {
        email,
        password,
      });

      localStorage.setItem("email", response.data.email);
      localStorage.setItem("studentEmail", response.data.email);
      localStorage.setItem("studentName", response.data.name || "");

      // ✅ certificate mail nunchi vachina vallaki direct my-certificates
      navigate("/my-certificates");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || "Invalid email or password");
    }
  };

  return (
    <>
      <Header />

      <div
        style={{
          minHeight: "100vh",
          background: "#eef4ff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            background: "#ffffff",
            borderRadius: "18px",
            padding: "30px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ marginTop: 0, color: "#1e3a8a" }}>Login</h2>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />

            {error && (
              <p style={{ color: "red", marginTop: "0", marginBottom: "12px" }}>
                {error}
              </p>
            )}

            <button type="submit" style={btnStyle}>
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
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

export default Login;