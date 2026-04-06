import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  return (
    <>
      <Header />

      <div style={{ padding: "30px", fontFamily: "Arial" }}>
        <h2>Dashboard</h2>
        <p>Login successful </p>
        <p>Welcome: {email}</p>

        <button
          onClick={() => navigate("/my-certificates")}
          style={{
            marginTop: "20px",
            padding: "10px 16px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          View My Certificate
        </button>
      </div>
    </>
  );
};

export default Dashboard;