import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signupUser } from "../services/authService.js";

const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const data = await signupUser({ email, password });
      console.log("SIGNUP SUCCESS:", data);
      alert("Signup Success ✅");
      navigate("/");
    } catch (error) {
      console.error("SIGNUP ERROR:", error.response?.data || error.message);
      alert(JSON.stringify(error.response?.data || "Signup Failed ❌"));
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
        <h2 style={{ textAlign: "center" }}>Signup Page</h2>

        <form onSubmit={handleSignup}>
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
              background: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Signup
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Already have account?{" "}
          <span
            onClick={() => navigate("/")}
            style={{ color: "blue", cursor: "pointer" }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;