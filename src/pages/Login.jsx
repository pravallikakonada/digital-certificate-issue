import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../services/authService.js";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser({ email, password });
      localStorage.setItem("email", data.email);
      alert("Login Success ✅");
      navigate("/dashboard");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(JSON.stringify(error.response?.data || "Login Failed ❌"));
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fb",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          width: "350px",
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Login Page</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "12px",
              boxSizing: "border-box",
            }}
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "12px",
              boxSizing: "border-box",
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Don’t have account?{" "}
          <span
            onClick={() => navigate("/signup")}
            style={{ color: "blue", cursor: "pointer" }}
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;