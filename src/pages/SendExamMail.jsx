import React, { useEffect, useState } from "react";
import api from "../services/api";
import Header from "../components/Header";

const COURSE_API = "/api/courses/";
const SEND_EXAM_API = "/api/exams/send-exam/";
const BULK_SEND_EXAM_API = "/api/exams/send-exam-bulk/";

const SendExamMail = () => {
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("single"); // "single" or "bulk"
  const [csvFile, setCsvFile] = useState(null);

  const fetchCourses = async () => {
    try {
      setCoursesLoading(true);
      setCoursesError(null);
      console.log("Fetching courses from:", COURSE_API);
      const res = await api.get(COURSE_API);
      console.log("COURSES DATA:", res.data);
      console.log("API Base URL:", api.defaults.baseURL);

      const courseList = Array.isArray(res.data) ? res.data : [];
      setCourses(courseList);
      
      if (courseList.length === 0) {
        console.warn("No courses returned from API");
        setCoursesError("No courses available");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      console.error("API Config:", {
        baseURL: api.defaults.baseURL,
        url: COURSE_API,
        fullURL: api.defaults.baseURL + COURSE_API,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
      });
      const errorMsg = `Failed to load courses: ${error?.response?.status === 404 ? 'API not found' : error?.message || 'Unknown error'}`;
      setCoursesError(errorMsg);
      alert(errorMsg);
    } finally {
      setCoursesLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSendExam = async (e) => {
    e.preventDefault();

    if (mode === "single") {
      if (!studentName.trim() || !studentEmail.trim() || !selectedCourse.trim()) {
        alert("Please fill in all fields");
        return;
      }

      try {
        setLoading(true);

        const response = await api.post(
          SEND_EXAM_API,
          {
            student_name: studentName.trim(),
            student_email: studentEmail.trim(),
            course_title: selectedCourse.trim(),
          },
          {
            timeout: 120000,
          }
        );

        console.log("Send exam response:", response.data);
        alert(response.data.message || "Exam mail sent successfully ✅");

        setStudentName("");
        setStudentEmail("");
        setSelectedCourse("");
      } catch (error) {
        console.error("Error sending exam:", error);
        
        let errorMsg = "Failed to send email";
        
        if (error?.response?.status === 403) {
          errorMsg = "Access Denied (403)\n\n⚠️ SOLUTION:\n" +
            "1. Django server might be blocking CSRF requests\n" +
            "2. Try restarting the backend server\n" +
            "3. Clear browser cache and try again\n" +
            "4. Check that backend is running on http://127.0.0.1:8000";
        } else if (error?.response?.status === 500) {
          errorMsg = "Server error (500). Check backend logs for details.\n\n⚠️ SOLUTION:\n" +
            "1. Check Django console for errors\n" +
            "2. Verify email configuration is correct\n" +
            "3. Restart Django server";
        } else if (error?.response?.status === 404) {
          errorMsg = "API endpoint not found (404)\n\n⚠️ SOLUTION:\n" +
            "1. Check if backend server is running\n" +
            "2. Verify backend is on http://127.0.0.1:8000\n" +
            "3. Check that Django migrations are complete";
        } else if (error?.response?.data?.error) {
          errorMsg = error.response.data.error;
          
          // Provide helpful suggestions for common errors
          if (errorMsg.includes("authentication") || errorMsg.includes("Auth")) {
            errorMsg += "\n\n⚠️ SOLUTION:\n" +
              "1. Check Gmail settings\n" +
              "2. Use App Password (not regular password)\n" +
              "3. Enable 2-factor authentication\n" +
              "4. Generate app password at: https://myaccount.google.com/apppasswords";
          } else if (errorMsg.includes("Connection")) {
            errorMsg += "\n\n⚠️ SOLUTION:\n" +
              "1. Check internet connection\n" +
              "2. Check if firewall blocks SMTP port 587\n" +
              "3. Try again in a moment";
          }
        } else if (error?.code === "ECONNABORTED") {
          errorMsg = "Request timeout (Network offline?)\n\n⚠️ SOLUTION:\n" +
            "1. Check internet connection\n" +
            "2. Verify backend server is running\n" +
            "3. Try again";
        } else if (error?.code === "ERR_NETWORK") {
          errorMsg = "Network Error - Cannot reach backend\n\n⚠️ SOLUTION:\n" +
            "1. Verify backend is running on http://127.0.0.1:8000\n" +
            "2. Check firewall/network settings\n" +
            "3. Restart Django server";
        } else if (error?.message) {
          errorMsg = `Network error: ${error.message}`;
        }
        
        alert(errorMsg);
      } finally {
        setLoading(false);
      }
    } else {
      // Bulk sending
      if (!csvFile || !selectedCourse.trim()) {
        alert("Please select a CSV file and course");
        return;
      }

      try {
        setLoading(true);

        const formData = new FormData();
        formData.append("file", csvFile);
        formData.append("course_title", selectedCourse.trim());

        const response = await api.post(BULK_SEND_EXAM_API, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 300000, // 5 minutes timeout for bulk sending
        });

        console.log("Bulk send exam response:", response.data);
        const successMsg = `${response.data.message || "Bulk exam mails sent ✅"}\n\nSent: ${response.data.sent || 0}\nFailed: ${response.data.failed || 0}`;
        alert(successMsg);

        setCsvFile(null);
        setSelectedCourse("");
      } catch (error) {
        console.error("Error bulk sending exam:", error?.response?.data || error);

        let errorMsg = "Failed to send bulk emails";
        
        if (error?.response?.data?.error) {
          errorMsg = error.response.data.error;
        } else if (error?.code === "ECONNABORTED") {
          errorMsg = "Server response timeout";
        }
        
        alert(errorMsg);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Header />

      <div style={container}>
        <div style={pageWrapper}>
          <div style={mainCard}>
            <div style={managementCard}>
              <div style={headerRow}>
                <div>
                  <p style={subTitle}>Exam Management</p>
                  <h2 style={headingTitle}>Send Exam Mail</h2>
                </div>

                <div style={editHeader}>
                  <span style={editIcon}>📧</span>
                  <span style={editLabel}>Send Exams</span>
                </div>
              </div>

              {/* Mode Selection */}
              <div style={modeSelection}>
                <label style={modeLabel}>Send Mode:</label>
                <div style={modeButtons}>
                  <button
                    type="button"
                    style={{
                      ...modeBtn,
                      backgroundColor: mode === "single" ? "#3b82f6" : "#e5e7eb",
                      color: mode === "single" ? "white" : "#374151"
                    }}
                    onClick={() => setMode("single")}
                  >
                    Single Student
                  </button>
                  <button
                    type="button"
                    style={{
                      ...modeBtn,
                      backgroundColor: mode === "bulk" ? "#10b981" : "#e5e7eb",
                      color: mode === "bulk" ? "white" : "#374151"
                    }}
                    onClick={() => setMode("bulk")}
                  >
                    Bulk (CSV Upload)
                  </button>
                </div>
              </div>

              <form onSubmit={handleSendExam} style={form}>
                {mode === "single" ? (
                  <div style={formSection}>
                    <h3 style={sectionTitle}>Single Student Details</h3>
                    <input
                      type="text"
                      placeholder="Student Name"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      style={input}
                      required
                    />

                    <input
                      type="email"
                      placeholder="Student Email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      style={input}
                      required
                    />
                  </div>
                ) : (
                  <div style={formSection}>
                    <h3 style={sectionTitle}>Bulk Upload</h3>
                    <div style={fileUploadSection}>
                      <label style={fileLabel}>Upload CSV File:</label>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setCsvFile(e.target.files[0])}
                        style={fileInput}
                        required
                      />
                      <small style={fileHelp}>
                        CSV format: student_name,student_email (one student per row, first row is header)
                      </small>
                    </div>
                  </div>
                )}

                <div style={formSection}>
                  <h3 style={sectionTitle}>Course Selection</h3>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    style={select}
                    required
                    disabled={coursesLoading || coursesError}
                  >
                    <option value="">
                      {coursesLoading ? "Loading courses..." : coursesError ? "Error loading courses" : "Select Course"}
                    </option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.title}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                  {coursesError && (
                    <div style={{ marginTop: "10px" }}>
                      <p style={{ color: "red", marginBottom: "5px", fontSize: "14px" }}>
                        {coursesError}
                      </p>
                      <button
                        type="button"
                        onClick={fetchCourses}
                        style={{
                          ...submitBtn,
                          background: "#6b7280",
                          padding: "8px 16px",
                          fontSize: "14px",
                          width: "auto"
                        }}
                        disabled={coursesLoading}
                      >
                        {coursesLoading ? "Retrying..." : "Retry Loading Courses"}
                      </button>
                    </div>
                  )}
                </div>

                <button type="submit" style={submitBtn} disabled={loading}>
                  {loading
                    ? (mode === "single" ? "Sending..." : "Bulk Sending...")
                    : (mode === "single" ? "Send Exam" : "Send Bulk Exams")
                  }
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const container = {
  minHeight: "100vh",
  width: "100vw",
  padding: "32px 18px",
  background: "#f3f4f6",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  boxSizing: "border-box",
};

const pageWrapper = {
  width: "min(980px, 100%)",
  display: "grid",
  gap: "22px",
};

const mainCard = {
  width: "100%",
  display: "grid",
  gap: "18px",
};

const managementCard = {
  background: "#ffffff",
  padding: "28px",
  borderRadius: "20px",
  border: "1px solid #e5e7eb",
};

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  marginBottom: "28px",
};

const subTitle = {
  margin: 0,
  fontSize: "14px",
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.12em",
};

const headingTitle = {
  margin: "8px 0 0",
  fontSize: "28px",
  color: "#0f172a",
};

const editHeader = {
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  borderRadius: "999px",
  padding: "10px 16px",
  color: "#1d4ed8",
  fontWeight: 600,
};

const editIcon = {
  fontSize: "18px",
};

const editLabel = {
  whiteSpace: "nowrap",
};

const modeSelection = {
  marginBottom: "28px",
};

const modeLabel = {
  display: "block",
  marginBottom: "12px",
  fontWeight: "600",
  color: "#374151",
  fontSize: "16px",
};

const modeButtons = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const modeBtn = {
  padding: "12px 20px",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
  transition: "all 0.2s",
  minWidth: "140px",
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const formSection = {
  background: "#f8fafc",
  padding: "20px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
};

const sectionTitle = {
  margin: "0 0 16px 0",
  fontSize: "18px",
  color: "#0f172a",
  fontWeight: "600",
};

const input = {
  width: "100%",
  padding: "12px 14px",
  marginBottom: "12px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  outline: "none",
  fontSize: "15px",
  background: "#ffffff",
  color: "#111827",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const select = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  outline: "none",
  fontSize: "15px",
  background: "#ffffff",
  color: "#111827",
  boxSizing: "border-box",
  cursor: "pointer",
};

const fileUploadSection = {
  marginBottom: "12px",
};

const fileLabel = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "600",
  color: "#374151",
  fontSize: "14px",
};

const fileInput = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  outline: "none",
  fontSize: "15px",
  background: "#ffffff",
  color: "#111827",
  boxSizing: "border-box",
  cursor: "pointer",
};

const fileHelp = {
  display: "block",
  marginTop: "6px",
  color: "#6b7280",
  fontSize: "12px",
  lineHeight: "1.4",
};

const submitBtn = {
  width: "100%",
  padding: "14px 16px",
  background: "#4338ca",
  color: "#ffffff",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "16px",
  transition: "background-color 0.2s",
  marginTop: "8px",
};

export default SendExamMail;