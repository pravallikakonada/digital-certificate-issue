import React, { useState, useEffect } from "react";
import api from "../services/api";
import Header from "../components/Header";
import { useLocation } from "react-router-dom";

const API = "/api/certificates/issue/";
const FALLBACK_API = "/api/certificates/";
const COMPLETED_TESTS_API = "/api/exams/completed-tests/";

const IssueCertificate = () => {
  const location = useLocation();

  const [eligibleStudents, setEligibleStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [studentName, setStudentName] = useState(location.state?.student_name || "");
  const [studentEmail, setStudentEmail] = useState(location.state?.student_email || "");
  const [courseTitle, setCourseTitle] = useState(location.state?.course_title || "");
  const [certificateId, setCertificateId] = useState("");
  const [status, setStatus] = useState("Issued");
  const [loading, setLoading] = useState(false);
  const [fetchingStudents, setFetchingStudents] = useState(true);

  // Fetch eligible students on component mount
  useEffect(() => {
    const fetchEligibleStudents = async () => {
      try {
        const apiResponse = await api.get(COMPLETED_TESTS_API);
        // Filter students who passed and don't have certificates issued yet
        const eligible = apiResponse.data.filter(
          student => student.result === "Passed" && 
                    student.eligible_for_certificate && 
                    student.status !== "Certificate Issued"
        );
        setEligibleStudents(eligible || []);
      } catch (error) {
        console.error("Error fetching eligible students:", error);
        setEligibleStudents([]);
        // Don't show alert on component mount, just log the error
      } finally {
        setFetchingStudents(false);
      }
    };

    fetchEligibleStudents();
  }, []);

  const generateCertificateId = () => {
    return "CERT-" + Math.floor(1000 + Math.random() * 9000);
  };

  const handleStudentSelect = (studentId) => {
    const selectedStudent = eligibleStudents.find(student => student.id === parseInt(studentId));
    if (selectedStudent) {
      setSelectedStudentId(studentId);
      setStudentName(selectedStudent.student_name);
      setStudentEmail(selectedStudent.student_email);
      setCourseTitle(selectedStudent.course_title);
      setCertificateId(generateCertificateId());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStudentId) {
      alert("Please select a student from the dropdown");
      return;
    }

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

      alert(
        response?.data?.message ||
          "Certificate issued successfully and mail sent"
      );

      try {
        await api.post("/api/exams/update-status/", {
          submission_id: selectedStudentId || location.state?.submission_id,
          status: "Certificate Issued",
        });
      } catch (statusError) {
        console.error("Failed to update exam status:", statusError);
      }

      // Reset form after successful submission
      setSelectedStudentId("");
      setStudentName("");
      setStudentEmail("");
      setCourseTitle("");
      setCertificateId("");
      setStatus("Issued");

      // Refresh the eligible students list
      const refreshResponse = await api.get(COMPLETED_TESTS_API);
      const eligible = refreshResponse.data.filter(
        student => student.result === "Passed" && 
                  student.eligible_for_certificate && 
                  student.status !== "Certificate Issued"
      );
      setEligibleStudents(eligible);
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
        <div style={layout}>
          {/* Left Side Form */}
          <div style={card}>
            <h2 style={heading}>Issue Certificate</h2>

            <form onSubmit={handleSubmit}>
              {/* Student Selection Dropdown */}
              <select
                value={selectedStudentId}
                onChange={(e) => handleStudentSelect(e.target.value)}
                style={select}
                disabled={fetchingStudents}
              >
                <option value="">
                  {fetchingStudents ? "Loading students..." : "Select a student to issue certificate"}
                </option>
                {eligibleStudents && eligibleStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.student_name} - {student.course_title} (Score: {student.score}/{student.total_questions})
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Student Name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                style={input}
                readOnly={!!selectedStudentId}
              />

              <input
                type="email"
                placeholder="Student Email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                style={input}
                readOnly={!!selectedStudentId}
              />

              <input
                type="text"
                placeholder="Course Title"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                style={input}
                readOnly={!!selectedStudentId}
              />

              <input
                type="text"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                style={input}
              />

              <input type="text" value={status} readOnly style={input} />

              <button type="submit" style={btn} disabled={loading}>
                {loading ? "Please wait ......" : "Issue Certificate"}
              </button>
            </form>
          </div>

          {/* Right Side Dummy Certificate Preview */}
          <div style={previewWrapper}>
            <h3 style={previewTitle}>Certificate Preview</h3>

            <div style={certificateBox}>
              <div style={certificateInner}>
                <p style={smallTop}>Digital Certificate</p>
                <h2 style={certificateHeading}>Certificate of Completion</h2>

                <p style={certText}>
                  This certificate is proudly presented to
                </p>

                <h3 style={studentNameStyle}>
                  {studentName || "Student Name"}
                </h3>

                <p style={certText}>for successfully completing</p>

                <h4 style={courseStyle}>{courseTitle || "Course Title"}</h4>

                <div style={detailsBox}>
                  <p>
                    <strong>Email:</strong> {studentEmail || "student@email.com"}
                  </p>
                  <p>
                    <strong>Certificate ID:</strong>{" "}
                    {certificateId || "CERT-0000"}
                  </p>
                  <p>
                    <strong>Status:</strong> {status}
                  </p>
                  <p>
                    <strong>Issue Date:</strong>{" "}
                    {new Date().toLocaleDateString()}
                  </p>
                </div>

                <div style={signatureRow}>
                  <div style={signBlock}>
                    <div style={line}></div>
                    <p style={signText}>Admin Signature</p>
                  </div>

                  <div style={sealCircle}>VALID</div>
                </div>
              </div>
            </div>

            <p style={mailNote}>
              After clicking <strong>Issue Certificate</strong>, certificate data
              will be saved and backend can send mail to the student.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

const container = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #eef4ff, #f8fbff)",
  padding: "30px 20px",
};

const layout = {
  maxWidth: "1200px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "30px",
  alignItems: "start",
};

const card = {
  width: "100%",
  background: "#fff",
  padding: "30px",
  borderRadius: "18px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
};

const heading = {
  marginBottom: "20px",
  color: "#1e3a8a",
  textAlign: "center",
};

const input = {
  width: "100%",
  padding: "13px",
  marginBottom: "14px",
  boxSizing: "border-box",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  outline: "none",
  fontSize: "15px",
};

const select = {
  width: "100%",
  padding: "13px",
  marginBottom: "14px",
  boxSizing: "border-box",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  outline: "none",
  fontSize: "15px",
  backgroundColor: "white",
  cursor: "pointer",
};

const btn = {
  width: "100%",
  padding: "13px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
};

const previewWrapper = {
  width: "100%",
};

const previewTitle = {
  color: "#1e3a8a",
  marginBottom: "14px",
  textAlign: "center",
};

const certificateBox = {
  background: "#fff",
  borderRadius: "18px",
  padding: "18px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
};

const certificateInner = {
  border: "6px solid #2563eb",
  borderRadius: "16px",
  padding: "24px 20px",
  background: "linear-gradient(180deg, #ffffff, #f8fbff)",
  textAlign: "center",
};

const smallTop = {
  color: "#2563eb",
  fontWeight: "bold",
  letterSpacing: "1px",
  marginBottom: "8px",
};

const certificateHeading = {
  fontSize: "28px",
  color: "#1e293b",
  marginBottom: "16px",
};

const certText = {
  color: "#475569",
  margin: "8px 0",
};

const studentNameStyle = {
  fontSize: "28px",
  color: "#0f172a",
  margin: "10px 0",
  fontWeight: "bold",
};

const courseStyle = {
  fontSize: "22px",
  color: "#2563eb",
  margin: "8px 0 18px",
};

const detailsBox = {
  background: "#f8fafc",
  borderRadius: "12px",
  padding: "14px",
  textAlign: "left",
  marginTop: "10px",
  lineHeight: "1.8",
  color: "#334155",
  fontSize: "14px",
};

const signatureRow = {
  marginTop: "26px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
};

const signBlock = {
  flex: 1,
  textAlign: "left",
};

const line = {
  width: "120px",
  borderTop: "2px solid #334155",
  marginBottom: "6px",
};

const signText = {
  fontSize: "13px",
  color: "#475569",
};

const sealCircle = {
  width: "70px",
  height: "70px",
  borderRadius: "50%",
  border: "3px solid #16a34a",
  color: "#16a34a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  fontSize: "14px",
};

const mailNote = {
  marginTop: "12px",
  color: "#475569",
  fontSize: "14px",
  textAlign: "center",
};

export default IssueCertificate;