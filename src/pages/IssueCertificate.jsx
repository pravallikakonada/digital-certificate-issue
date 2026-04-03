import React, { useState } from "react";
import axios from "axios";
import Header from "../components/Header";

const API = "https://certificate-backend-mxjt.onrender.com/api/certificates/issue/";

const IssueCertificate = () => {
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [certificateId, setCertificateId] = useState(
    "CERT-" + Math.floor(1000 + Math.random() * 9000)
  );
  const [status, setStatus] = useState("Issued");
  const [loading, setLoading] = useState(false);

  const generateNewCertificateId = () => {
    return "CERT-" + Math.floor(1000 + Math.random() * 9000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentName.trim() || !studentEmail.trim() || !courseTitle.trim()) {
      alert("All fields fill cheyyi");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        API,
        {
          student_name: studentName.trim(),
          student_email: studentEmail.trim(),
          course_title: courseTitle.trim(),
          certificate_id: certificateId,
          status: status,
        },
        {
          timeout: 120000,
        }
      );

      alert(response?.data?.message || "Certificate issued successfully ✅");

      setStudentName("");
      setStudentEmail("");
      setCourseTitle("");
      setCertificateId(generateNewCertificateId());
      setStatus("Issued");
    } catch (error) {
      console.error("Issue certificate error:", error?.response?.data || error);

      if (error.code === "ECONNABORTED") {
        alert("Certificate create ayye chance undi. Certificate List / My Certificates check cheyyi ✅");
      } else if (error?.response?.data?.error) {
        alert(error.response.data.error);
      } else if (error?.response?.status) {
        alert(`Server error: ${error.response.status}`);
      } else {
        alert("Certificate issue avvaledu ❌");
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
          <h2 style={title}>Issue Certificate</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Student Name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              style={input}
            />

            <input
              type="email"
              placeholder="Student Email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              style={input}
            />

            <input
              type="text"
              placeholder="Course Title"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              style={input}
            />

            <input
              type="text"
              value={certificateId}
              readOnly
              style={input}
            />

            <input
              type="text"
              value={status}
              readOnly
              style={input}
            />

            <button type="submit" style={btn} disabled={loading}>
              {loading ? "Issuing..." : "Issue Certificate"}
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
  maxWidth: "500px",
  background: "#fff",
  padding: "30px",
  borderRadius: "15px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
};

const title = {
  marginBottom: "20px",
  color: "#1e3a8a",
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  boxSizing: "border-box",
  border: "1px solid #ccc",
  borderRadius: "8px",
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
  fontSize: "16px",
  fontWeight: "600",
};

export default IssueCertificate;