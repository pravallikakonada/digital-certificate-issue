import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://192.168.29.45:8000";

const AuthExam = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const studentNameFromLink = params.get("name") || "";
  const studentEmailFromLink = params.get("email") || "";
  const courseFromLink = params.get("course") || "";

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState(studentNameFromLink);
  const [email, setEmail] = useState(studentEmailFromLink);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const goToTest = () => {
    navigate(
      `/take-test?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&course=${encodeURIComponent(courseFromLink)}`
    );
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API_BASE_URL}/api/accounts/login/`, {
        email,
        password,
      });

      localStorage.setItem("studentEmail", email);
      localStorage.setItem("studentName", name);

      alert("Login successful ✅");
      goToTest();
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

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

    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API_BASE_URL}/api/accounts/signup/`, {
        name,
        email,
        password,
      });

      localStorage.setItem("studentEmail", email);
      localStorage.setItem("studentName", name);

      alert("Signup successful ✅");
      goToTest();
    } catch (err) {
      console.error(err);
      setError("Signup failed. Email may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
          maxWidth: "450px",
          background: "#ffffff",
          borderRadius: "18px",
          padding: "30px",
          boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ marginTop: 0, color: "#1e3a8a" }}>
          {isLogin ? "Login to Start Exam" : "Signup to Start Exam"}
        </h2>

        <p style={{ color: "#555", marginBottom: "20px" }}>
          <b>Course:</b> {courseFromLink}
        </p>

        <form onSubmit={isLogin ? handleLogin : handleSignup}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
          )}

          {isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <input
            type="password"
            placeholder={isLogin ? "Enter Password" : "Create Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
            />
          )}

          {error && (
            <p
              style={{
                color: "red",
                marginTop: "0",
                marginBottom: "12px",
                fontSize: "14px",
              }}
            >
              {error}
            </p>
          )}

          <button type="submit" style={btnStyle} disabled={loading}>
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login & Start Exam"
              : "Signup & Start Exam"}
          </button>
        </form>

        <p style={{ marginTop: "18px", color: "#444" }}>
          {isLogin ? "New user?" : "Already have an account?"}{" "}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            style={{
              color: "#2563eb",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            {isLogin ? "Signup here" : "Login here"}
          </span>
        </p>
      </div>
    </div>
  );
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