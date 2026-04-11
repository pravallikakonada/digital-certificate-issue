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
      <style>
        {`
          @keyframes slideInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          input:focus, select:focus {
            border-color: #8b5cf6 !important;
            box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1) !important;
          }
        `}
      </style>
      <Header />

      <div style={container}>
        <div style={contentWrapper}>
          <div style={headerSection}>
            <div style={headerBadge}>📧</div>
            <h1 style={pageTitle}>Send Exam</h1>
            <p style={pageSubtitle}>Distribute exams to students via email</p>
          </div>

          <div style={twoColumnLayout}>
            <div style={formCard}>
              <div style={formHeader}>
                <h2 style={formTitle}>Send Exam Mail</h2>
                <span style={formBadge}>
                  {mode === "single" ? "👤 Single Student" : "📦 Bulk Upload"}
                </span>
              </div>

              {/* Mode Selection */}
              <div style={modeSelection}>
                <div style={modeButtons}>
                  <button
                    type="button"
                    style={{
                      ...modeBtn,
                      background: mode === "single" ? "#8b5cf6" : "rgba(139, 92, 246, 0.1)",
                      color: mode === "single" ? "white" : "#7c3aed",
                      borderColor: mode === "single" ? "#8b5cf6" : "transparent"
                    }}
                    onClick={() => setMode("single")}
                  >
                    Single Student
                  </button>
                  <button
                    type="button"
                    style={{
                      ...modeBtn,
                      background: mode === "bulk" ? "#8b5cf6" : "rgba(139, 92, 246, 0.1)",
                      color: mode === "bulk" ? "white" : "#7c3aed",
                      borderColor: mode === "bulk" ? "#8b5cf6" : "transparent"
                    }}
                    onClick={() => setMode("bulk")}
                  >
                    Bulk Upload
                  </button>
                </div>
              </div>

              <form onSubmit={handleSendExam} style={form}>
                {mode === "single" ? (
                  <>
                    <div style={formGroup}>
                      <label style={formLabel}>Student Name</label>
                      <input
                        type="text"
                        placeholder="Enter student name"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        style={formInput}
                        required
                      />
                    </div>

                    <div style={formGroup}>
                      <label style={formLabel}>Student Email</label>
                      <input
                        type="email"
                        placeholder="Enter student email"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        style={formInput}
                        required
                      />
                    </div>
                  </>
                ) : (
                  <div style={formGroup}>
                    <label style={formLabel}>Upload CSV File</label>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => setCsvFile(e.target.files[0])}
                      style={formInput}
                      required
                    />
                    <p style={fileHelp}>Format: student_name,student_email (header row required)</p>
                  </div>
                )}

                <div style={formGroup}>
                  <label style={formLabel}>Select Course</label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    style={formSelect}
                    required
                    disabled={coursesLoading || coursesError}
                  >
                    <option value="">
                      {coursesLoading ? "Loading courses..." : coursesError ? "Error loading courses" : "Choose a course"}
                    </option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.title}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                {coursesError && (
                  <div style={errorBox}>
                    <p style={errorText}>⚠️ {coursesError}</p>
                    <button
                      type="button"
                      onClick={fetchCourses}
                      style={retryBtn}
                      disabled={coursesLoading}
                    >
                      {coursesLoading ? "Retrying..." : "Retry"}
                    </button>
                  </div>
                )}

                <button type="submit" style={submitBtn} disabled={loading}>
                  {loading
                    ? (mode === "single" ? "Sending..." : "Bulk Sending...")
                    : (mode === "single" ? "Send Exam" : "Send Bulk Exams")
                  }
                </button>
              </form>
            </div>

            <div style={infoSection}>
              <div style={infoCard}>
                <div style={infoIcon}>📧</div>
                <h3 style={infoTitle}>Single Student</h3>
                <p style={infoText}>Send exam invitation to a specific student via email</p>
              </div>

              <div style={infoCard}>
                <div style={infoIcon}>📦</div>
                <h3 style={infoTitle}>Bulk Upload</h3>
                <p style={infoText}>Import CSV file to send exams to multiple students at once</p>
              </div>

              <div style={infoCard}>
                <div style={infoIcon}>📚</div>
                <h3 style={infoTitle}>Course Selection</h3>
                <p style={infoText}>Choose the course for which the exam will be sent</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const container = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #3730a3 0%, #7c3aed 50%, #a78bfa 100%)",
  padding: "40px 20px 60px",
  fontFamily: "system-ui, -apple-system, sans-serif",
};

const contentWrapper = {
  maxWidth: "1200px",
  margin: "0 auto",
  animation: "slideInUp 0.6s ease-out",
};

const headerSection = {
  textAlign: "center",
  marginBottom: "40px",
  animation: "slideInUp 0.8s ease-out",
};

const headerBadge = {
  fontSize: "48px",
  marginBottom: "16px",
  display: "inline-block",
};

const pageTitle = {
  fontSize: "40px",
  fontWeight: "700",
  color: "white",
  margin: "0 0 8px",
  letterSpacing: "-0.5px",
};

const pageSubtitle = {
  fontSize: "16px",
  color: "rgba(255, 255, 255, 0.8)",
  margin: "0",
  fontWeight: "500",
};

const twoColumnLayout = {
  display: "grid",
  gridTemplateColumns: window.innerWidth > 900 ? "1fr 1.2fr" : "1fr",
  gap: "30px",
  alignItems: "start",
};

const formCard = {
  background: "white",
  borderRadius: "16px",
  padding: "32px",
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
  animation: "slideInLeft 0.6s ease-out",
};

const formHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
  paddingBottom: "16px",
  borderBottom: "2px solid #f3e8ff",
};

const formTitle = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#1f2937",
  margin: "0",
};

const formBadge = {
  background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
  color: "white",
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
};

const modeSelection = {
  marginBottom: "24px",
};

const modeButtons = {
  display: "flex",
  gap: "12px",
};

const modeBtn = {
  flex: 1,
  padding: "10px 16px",
  border: "2px solid transparent",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "13px",
  transition: "all 0.2s ease",
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const formGroup = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const formLabel = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#374151",
};

const formInput = {
  padding: "12px 14px",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  fontSize: "14px",
  background: "#f9fafb",
  color: "#111827",
  boxSizing: "border-box",
  transition: "all 0.2s ease",
};

const formSelect = {
  padding: "12px 14px",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  fontSize: "14px",
  background: "#f9fafb",
  color: "#111827",
  cursor: "pointer",
  boxSizing: "border-box",
  transition: "all 0.2s ease",
};

const fileHelp = {
  fontSize: "12px",
  color: "#6b7280",
  margin: "4px 0 0",
  lineHeight: "1.4",
};

const errorBox = {
  background: "#fee2e2",
  border: "1px solid #fecaca",
  borderRadius: "8px",
  padding: "12px 14px",
  marginTop: "8px",
};

const errorText = {
  fontSize: "13px",
  color: "#991b1b",
  margin: "0 0 8px",
};

const retryBtn = {
  padding: "8px 14px",
  background: "#7c3aed",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontSize: "12px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const submitBtn = {
  padding: "12px 16px",
  background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s ease",
  marginTop: "8px",
  boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)",
};

const infoSection = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "16px",
  animation: "slideInLeft 0.8s ease-out",
};

const infoCard = {
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  borderRadius: "12px",
  padding: "20px",
  textAlign: "center",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  transition: "all 0.3s ease",
};

const infoIcon = {
  fontSize: "32px",
  marginBottom: "12px",
  display: "block",
};

const infoTitle = {
  fontSize: "16px",
  fontWeight: "700",
  color: "#1f2937",
  margin: "0 0 8px",
};

const infoText = {
  fontSize: "13px",
  color: "#6b7280",
  margin: "0",
  lineHeight: "1.5",
};

export default SendExamMail;