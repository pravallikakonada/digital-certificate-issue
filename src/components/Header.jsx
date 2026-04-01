import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const handleLogout = () => {
    localStorage.removeItem("email");
    navigate("/");
  };

  return (
    <div
      style={{
        background: "#1e3a8a",
        color: "white",
        padding: "14px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Title */}
      <h2 style={{ margin: 0 }}>Digital Certificate System</h2>

      {/* Links */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <Link to="/dashboard" style={linkStyle}>
          Dashboard
        </Link>
        <Link to="/send-exam-mail" style={linkStyle}>Send Exam</Link>
<Link to="/completed-tests" style={linkStyle}>Completed Tests</Link>
        <Link to="/upload" style={linkStyle}>
          Upload CSV
        </Link>
        <Link to="/issue" style={linkStyle}>
          Issue
        </Link>

        <Link to="/my-certificates" style={linkStyle}>
          My Certificate
        </Link>

        <Link to="/verify" style={linkStyle}>
          Verify
        </Link>

        {/* Email */}
        <span style={{ fontSize: "14px" }}>{email}</span>

        {/* Logout */}
        <button onClick={handleLogout} style={btnStyle}>
          Logout
        </button>
      </div>
    </div>
  );
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "500",
};

const btnStyle = {
  padding: "6px 12px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

export default Header;