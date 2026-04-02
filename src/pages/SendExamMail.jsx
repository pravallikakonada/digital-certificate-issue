import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";

const COURSE_API = "https://certificate-backend-mxjt.onrender.com/api/courses/";
const SEND_EXAM_API = "https://certificate-backend-mxjt.onrender.com/api/exams/send-exam/";

const SendExamMail = () => {
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(COURSE_API);
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      alert("Courses load avvaledu ❌");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSendExam = async (e) => {
    e.preventDefault();

    if (!studentName.trim() || !studentEmail.trim() || !selectedCourse) {
      alert("All fields fill cheyyi");
      return;
    }

    try {
      setLoading(true);

      await axios.post(SEND_EXAM_API, {
        student_name: studentName,
        student_email: studentEmail,
        course_title: selectedCourse,
      });

      alert("Exam mail sent successfully ✅");
      setStudentName("");
      setStudentEmail("");
      setSelectedCourse("");
    } catch (error) {
      console.error("Error sending exam mail:", error);
      alert("Mail send avvaledu ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div style={container}>
        <div style={card}>
          <h2>Send Exam Mail</h2>

          <form onSubmit={handleSendExam}>
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

            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              style={input}
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.title}>
                  {course.title}
                </option>
              ))}
            </select>

            <button type="submit" style={btn} disabled={loading}>
              {loading ? "Sending..." : "Send Exam"}
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
  padding: "10px",
  marginBottom: "12px",
  boxSizing: "border-box",
};

const btn = {
  width: "100%",
  padding: "10px",
  background: "#2563eb",
  color: "white",
  border: "none",
  cursor: "pointer",
};

export default SendExamMail;