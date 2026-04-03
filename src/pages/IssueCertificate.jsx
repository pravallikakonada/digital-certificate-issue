import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";

const API = "https://certificate-backend-mxjt.onrender.com/api/certificates/";

const IssueCertificate = () => {
  const location = useLocation();

  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [certificateId, setCertificateId] = useState("");
  const [status, setStatus] = useState("Issued");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state) {
      setStudentName(location.state.student_name || "");
      setStudentEmail(location.state.student_email || "");
      setCourseTitle(location.state.course_title || "");
    }

    const randomId = "CERT-" + Math.floor(1000 + Math.random() * 9000);
    setCertificateId(randomId);
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(API, {
        student_name: studentName,
        student_email: studentEmail,
        course_title: courseTitle,
        certificate_id: certificateId,
        status: status,
      });

      alert("Certificate issued successfully ✅");
    } catch (error) {
      console.error("Error issuing certificate:", error);
      alert("Certificate issue avvaledu ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div style={container}>
        <div style={card}>
          <h2>Issue Certificate</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={studentName}
              readOnly
              style={input}
              placeholder="Student Name"
            />

            <input
              type="email"
              value={studentEmail}
              readOnly
              style={input}
              placeholder="Student Email"
            />

            <input
              type="text"
              value={courseTitle}
              readOnly
              style={input}
              placeholder="Course Title"
            />

            <input
              type="text"
              value={certificateId}
              readOnly
              style={input}
              placeholder="Certificate ID"
            />

            <input
              type="text"
              value={status}
              readOnly
              style={input}
              placeholder="Status"
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
};

const card = {
  width: "500px",
  background: "#fff",
  padding: "30px",
  borderRadius: "15px",
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  boxSizing: "border-box",
};

const btn = {
  width: "100%",
  padding: "12px",
  background: "#2563eb",
  color: "white",
  border: "none",
  cursor: "pointer",
};

export default IssueCertificate;