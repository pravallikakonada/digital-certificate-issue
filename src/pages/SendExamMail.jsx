import { useState } from "react";
import axios from "axios";
import Header from "../components/Header";

const SendExamMail = () => {
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [courseTitle, setCourseTitle] = useState("");

  const handleSendMail = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://127.0.0.1:8000/api/exams/send-exam-mail/", {
        student_name: studentName,
        student_email: studentEmail,
        course_title: courseTitle,
      });

      alert("Exam mail sent successfully ✅");
      setStudentName("");
      setStudentEmail("");
      setCourseTitle("");
    } catch (error) {
      console.error("Error sending exam mail:", error);
      alert("Failed to send exam mail ❌");
    }
  };

  return (
    <>
      <Header />

      <div
        style={{
          minHeight: "100vh",
          background: "#f3f6ff",
          padding: "30px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            background: "white",
            padding: "30px",
            borderRadius: "18px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          }}
        >
          <h1 style={{ marginTop: 0, color: "#1e3a8a" }}>Send Exam Mail</h1>

          <form onSubmit={handleSendMail}>
            <input
              type="text"
              placeholder="Student Name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              style={inputStyle}
            />

            <input
              type="email"
              placeholder="Student Email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Course Title"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              style={inputStyle}
            />

            <button type="submit" style={btnStyle}>
              Send Exam Mail
            </button>
          </form>
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

const btnStyle = {
  padding: "12px 20px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

export default SendExamMail;