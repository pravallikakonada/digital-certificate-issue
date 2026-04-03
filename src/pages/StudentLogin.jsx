import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

      alert("Login successful ✅");
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

      <div style={container}>
        <div style={card}>
          <h2 style={title}>Student Login</h2>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Student Email"
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

const container = {
  minHeight: "100vh",
  background: "#eef4ff",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
};

const card = {
  width: "100%",
  maxWidth: "420px",
  background: "#fff",
  padding: "28px",
  borderRadius: "18px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
};

const title = {
  color: "#1e3a8a",
  marginTop: 0,
  marginBottom: "18px",
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
  fontSize: "15px",
};

const btn = {
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

export default StudentLogin;