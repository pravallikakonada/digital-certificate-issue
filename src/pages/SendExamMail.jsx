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
      setCourses(res.data || []);
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

    if (!studentName.trim() || !studentEmail.trim() || !selectedCourse.trim()) {
      alert("All fields fill cheyyi");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        SEND_EXAM_API,
        {
          student_name: studentName.trim(),
          student_email: studentEmail.trim(),
          course_title: selectedCourse.trim(),
        },
        {
          timeout: 30000,
        }
      );

      console.log("Send exam response:", response.data);
      alert("Exam mail sent successfully ");

      setStudentName("");
      setStudentEmail("");
      setSelectedCourse("");
    } catch (error) {
      console.error("Error sending exam:", error?.response?.data || error);

      if (error.code === "ECONNABORTED") {
        alert("Server response late avthundi / timeout ❌");
      } else if (error?.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert("Mail not send❌");
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
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  boxSizing: "border-box",
  border: "1px solid #ccc",
  borderRadius: "8px",
};

const btn = {
  width: "100%",
  padding: "12px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

export default SendExamMail;