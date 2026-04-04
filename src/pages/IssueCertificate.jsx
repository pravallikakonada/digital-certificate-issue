import React, { useState } from "react";
import api from "../services/api";
import Header from "../components/Header";
import { useLocation } from "react-router-dom";

const API = "/api/certificates/issue/";
const FALLBACK_API = "/api/certificates/";

const IssueCertificate = () => {
  const location = useLocation();

  const [studentName, setStudentName] = useState(location.state?.student_name || "");
  const [studentEmail, setStudentEmail] = useState(location.state?.student_email || "");
  const [courseTitle, setCourseTitle] = useState(location.state?.course_title || "");
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
      alert("Please fill in all fields");
      return;
    }

    const payload = {
      student_name: studentName.trim(),
      student_email: studentEmail.trim(),
      course_title: courseTitle.trim(),
      certificate_id: certificateId,
      status: status,
    };

    try {
      setLoading(true);

      let response;

      try {
        response = await api.post(API, payload, {
          timeout: 120000,
        });
      } catch (firstError) {
        if (
          firstError?.response?.status === 404 ||
          firstError?.response?.status === 405
        ) {
          response = await api.post(FALLBACK_API, payload, {
            timeout: 180000,
          });
        } else {
          throw firstError;
        }
      }

      alert(response?.data?.message || "Certificate issued successfully and mail sent ");

      // Update exam submission status to "Certificate Issued"
      try {
        await api.post("/api/exams/update-status/", {
          submission_id: location.state?.submission_id,
          status: "Certificate Issued"
        });
      } catch (statusError) {
        console.error("Failed to update exam status:", statusError);
        // Don't show error to user as certificate was already issued successfully
      }

      setStudentName("");
      setStudentEmail("");
      setCourseTitle("");
      setCertificateId(generateNewCertificateId());
      setStatus("Issued");
    } catch (error) {
      console.error("Issue certificate error:", error?.response?.data || error);

      if (error.code === "ECONNABORTED") {
        alert("Server timeout occurred. Please check My Certificates ✅");
      } else if (error?.response?.data?.error) {
        alert(error.response.data.error);
      } else if (error?.response?.status) {
        alert(`Server error: ${error.response.status}`);
      } else {
        alert("Failed to issue certificate ❌");
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
          <h2>Issue Certificate</h2>

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
  onChange={(e) => setCertificateId(e.target.value)}
  style={input}
/>
            <input
              type="text"
              value={status}
              readOnly
              style={input}
            />

            <button type="submit" style={btn} disabled={loading}>
              {loading ? "Please wait ......" : "Issue Certificate"}
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