import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";

const API_BASE_URL = "http://127.0.0.1:8000";

const SendExamMail = () => {
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/courses/`);
      setCourses(response.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      alert("Failed to load courses ❌");
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleSendMail = async (e) => {
    e.preventDefault();

    if (!studentName.trim() || !studentEmail.trim() || !courseTitle.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      setSending(true);

      await axios.post(`${API_BASE_URL}/api/exams/send-exam-mail/`, {
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
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Header />

      <div
        style={{
          minHeight: "100vh",
          background: "#eef4ff",
          padding: "30px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            background: "#fff",
            padding: "30px",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          }}
        >
          <h1 style={{ color: "#1e3a8a", marginTop: 0 }}>Send Exam Mail</h1>

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

            <select
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              style={inputStyle}
              disabled={loadingCourses}
            >
              <option value="">
                {loadingCourses ? "Loading courses..." : "Select Course"}
              </option>

              {courses.map((course) => (
                <option key={course.id} value={course.title}>
                  {course.title}
                </option>
              ))}
            </select>

            <button type="submit" style={btnStyle} disabled={sending}>
              {sending ? "Sending..." : "Send Exam Mail"}
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
  fontSize: "15px",
};

const btnStyle = {
  width: "100%",
  padding: "12px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "15px",
};

export default SendExamMail;