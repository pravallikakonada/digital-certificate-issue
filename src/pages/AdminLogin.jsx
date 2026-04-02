import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const ADMIN_EMAIL = "pravallikakonada984@gmail.com";

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === ADMIN_EMAIL && password === "123456") {
      localStorage.setItem("email", email);
      localStorage.setItem("role", "admin");
      navigate("/admin-dashboard");
    } else {
      setError("Admin login failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-[300px]"
      >
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Login as Admin
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;