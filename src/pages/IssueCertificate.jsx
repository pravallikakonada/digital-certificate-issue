import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header.jsx";
import axios from "axios";

const API_BASE_URL = "http://192.168.29.45:8000";

const IssueCertificate = () => {
  const location = useLocation();

  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [certificateId, setCertificateId] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [status, setStatus] = useState("Issued");
  const [loading, setLoading] = useState(false);

  const generateCertificateId = () => {
    return "CERT-" + Math.floor(100000 + Math.random() * 900000);
  };

  useEffect(() => {
    if (location.state) {
      setStudentName(location.state.studentName || "");
      setStudentEmail(location.state.studentEmail || "");
      setCourseTitle(location.state.courseTitle || "");
      setStatus(location.state.status || "Issued");
    }

    setCertificateId(generateCertificateId());
    setIssueDate(new Date().toISOString().split("T")[0]);
  }, [location.state]);

  const resetForm = () => {
    setStudentName("");
    setStudentEmail("");
    setCourseTitle("");
    setCertificateId(generateCertificateId());
    setIssueDate(new Date().toISOString().split("T")[0]);
    setStatus("Issued");
  };

  const handleIssue = async (e) => {
    e.preventDefault();

    if (!studentName || !studentEmail || !courseTitle || !certificateId) {
      alert("Please fill all required fields");
      return;
    }

    const data = {
      student_name: studentName,
      student_email: studentEmail,
      course_title: courseTitle,
      certificate_id: certificateId,
      issue_date: issueDate,
      status: status,
    };

    try {
      setLoading(true);

      await axios.post(`${API_BASE_URL}/api/certificates/issue/`, data);

      alert("Certificate Issued Successfully ✅\nMail sent to student 📧");
      resetForm();
    } catch (error) {
      console.error("Issue certificate error:", error);
      alert(error?.response?.data?.error || "Error issuing certificate ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #eef4ff, #f8fbff)",
          padding: "30px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h1 style={{ color: "#1e3a8a" }}>Issue Certificate</h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr",
              gap: "25px",
              alignItems: "start",
            }}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: "18px",
                padding: "28px",
                boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
              }}
            >
              <form onSubmit={handleIssue}>
                <input
                  placeholder="Student Name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  style={inputStyle}
                />

                <input
                  placeholder="Student Email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  style={inputStyle}
                />

                <input
                  placeholder="Course Title"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  style={inputStyle}
                />

                <input
                  placeholder="Certificate ID"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  style={inputStyle}
                />

                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  style={inputStyle}
                />

                <button style={btn} disabled={loading}>
                  {loading ? "Issuing..." : "Issue Certificate"}
                </button>
              </form>
            </div>

            <div
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "15px",
              }}
            >
              <h3>Preview</h3>
              <p><b>Name:</b> {studentName}</p>
              <p><b>Email:</b> {studentEmail}</p>
              <p><b>Course:</b> {courseTitle}</p>
              <p><b>Certificate ID:</b> {certificateId}</p>
              <p><b>Date:</b> {issueDate}</p>
              <p><b>Status:</b> {status}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
};

const btn = {
  padding: "12px 20px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

export default IssueCertificate;