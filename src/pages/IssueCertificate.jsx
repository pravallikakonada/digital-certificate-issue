import React, { useState, useEffect } from "react";
import api from "../services/api";
import Header from "../components/Header";
import { useLocation, useNavigate } from "react-router-dom";

const API = "/api/certificates/issue/";
const FALLBACK_API = "/api/certificates/";
const COMPLETED_TESTS_API = "/api/exams/completed-tests/";

const IssueCertificate = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [eligibleStudents, setEligibleStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [studentName, setStudentName] = useState(location.state?.student_name || "");
  const [studentEmail, setStudentEmail] = useState(location.state?.student_email || "");
  const [courseTitle, setCourseTitle] = useState(location.state?.course_title || "");
  const [certificateId, setCertificateId] = useState("");
  const [status, setStatus] = useState("Issued");
  const [template, setTemplate] = useState("classic");
  const [loading, setLoading] = useState(false);
  const [fetchingStudents, setFetchingStudents] = useState(true);

  // Fetch eligible students on component mount
  useEffect(() => {
    const fetchEligibleStudents = async () => {
      try {
        // First, check for localStorage data before fetching
        const testDataFromStorage = localStorage.getItem('certificateTestData');
        let storedTestData = null;
        if (testDataFromStorage) {
          storedTestData = JSON.parse(testDataFromStorage);
        }

        const apiResponse = await api.get(COMPLETED_TESTS_API);
        // Filter students who passed and don't have certificates issued yet
        const eligible = apiResponse.data.filter(
          student => student.result === "Passed" && 
                    student.eligible_for_certificate && 
                    student.status !== "Certificate Issued"
        );
        setEligibleStudents(eligible || []);

        // Auto-load test data from localStorage if coming from CompletedTests
        if (storedTestData) {
          // Find matching student in eligible list
          const matchingStudent = eligible.find(s => String(s.id) === String(storedTestData.id));
          
          if (matchingStudent) {
            // Student is in eligible list - auto-fill and select
            setSelectedStudentId(String(matchingStudent.id));
            setStudentName(matchingStudent.student_name);
            setStudentEmail(matchingStudent.student_email);
            setCourseTitle(matchingStudent.course_title);
            setCertificateId(generateCertificateId());
          } else {
            // Student not in eligible list - still auto-fill the form fields
            setStudentName(storedTestData.student_name);
            setStudentEmail(storedTestData.student_email);
            setCourseTitle(storedTestData.course_title);
            setCertificateId(generateCertificateId());
            // Don't set selectedStudentId since student is not in dropdown
          }
          
          // Clear the stored data after using it
          localStorage.removeItem('certificateTestData');
        }
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
      template: template,
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
          "Certificate issued successfully and mail sent\n\nRedirecting back to completed tests..."
      );

      // Redirect back to completed tests page after successful issuance
      setTimeout(() => {
        navigate('/completed-tests');
      }, 2000); // 2 second delay to show the success message

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
      setTemplate("classic");

      // Clear any remaining localStorage data
      localStorage.removeItem('certificateTestData');

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

              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                style={select}
              >
                <option value="classic">Classic Template</option>
                <option value="modern">Modern Template</option>
                <option value="elegant">Elegant Template</option>
              </select>

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
  background: "linear-gradient(180deg, #0f172a 0%, #312e81 45%, #4338ca 100%)",
  padding: "30px 20px 50px",
  color: "white",
};

const layout = {
  maxWidth: "1200px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "1.05fr 0.95fr",
  gap: "32px",
  alignItems: "start",
};

const card = {
  width: "100%",
  background: "rgba(255,255,255,0.08)",
  borderRadius: "28px",
  padding: "32px",
  border: "1px solid rgba(255,255,255,0.16)",
  boxShadow: "0 25px 80px rgba(15, 23, 42, 0.25)",
};

const heading = {
  marginBottom: "24px",
  color: "white",
  textAlign: "center",
  fontSize: "2rem",
  letterSpacing: "-0.02em",
};

const input = {
  width: "100%",
  padding: "14px 16px",
  marginBottom: "16px",
  boxSizing: "border-box",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.18)",
  outline: "none",
  background: "rgba(255,255,255,0.12)",
  color: "white",
  fontSize: "15px",
  transition: "all 0.2s ease",
};

const select = {
  width: "100%",
  padding: "14px 16px",
  marginBottom: "16px",
  boxSizing: "border-box",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.18)",
  outline: "none",
  fontSize: "15px",
  backgroundColor: "rgba(255,255,255,0.12)",
  color: "white",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const btn = {
  width: "100%",
  padding: "15px 16px",
  background: "linear-gradient(135deg, #818cf8, #6366f1)",
  color: "white",
  border: "none",
  borderRadius: "16px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "700",
  letterSpacing: "0.01em",
  boxShadow: "0 14px 30px rgba(99, 102, 241, 0.28)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

const previewWrapper = {
  width: "100%",
  display: "grid",
  gap: "20px",
};

const previewTitle = {
  color: "#eef2ff",
  marginBottom: "16px",
  textAlign: "center",
  fontSize: "1.5rem",
  fontWeight: "700",
};

const certificateBox = {
  background: "rgba(255,255,255,0.12)",
  borderRadius: "28px",
  padding: "24px",
  border: "1px solid rgba(255,255,255,0.18)",
  boxShadow: "0 20px 50px rgba(15, 23, 42, 0.25)",
};

const certificateInner = {
  border: "4px solid rgba(99, 102, 241, 0.58)",
  borderRadius: "22px",
  padding: "28px 24px",
  background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(243,244,246,0.9))",
  textAlign: "center",
};

const smallTop = {
  color: "#4338ca",
  fontWeight: "800",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  marginBottom: "10px",
  fontSize: "0.85rem",
};

const certificateHeading = {
  fontSize: "2rem",
  color: "#111827",
  marginBottom: "18px",
  lineHeight: "1.1",
};

const certText = {
  color: "#4b5563",
  margin: "10px 0",
  fontSize: "1rem",
};

const studentNameStyle = {
  fontSize: "2rem",
  color: "#111827",
  margin: "14px 0",
  fontWeight: "800",
};

const courseStyle = {
  fontSize: "1.5rem",
  color: "#4338ca",
  margin: "8px 0 18px",
  fontWeight: "700",
};

const detailsBox = {
  background: "#eef2ff",
  borderRadius: "16px",
  padding: "18px 20px",
  textAlign: "left",
  marginTop: "12px",
  lineHeight: "1.8",
  color: "#334155",
  fontSize: "0.95rem",
};

const signatureRow = {
  marginTop: "28px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  flexWrap: "wrap",
};

const signBlock = {
  flex: 1,
  textAlign: "left",
};

const line = {
  width: "140px",
  borderTop: "2px solid #4338ca",
  marginBottom: "8px",
};

const signText = {
  fontSize: "0.95rem",
  color: "#475569",
};

const sealCircle = {
  width: "82px",
  height: "82px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "800",
  fontSize: "15px",
  boxShadow: "0 18px 40px rgba(16, 185, 129, 0.22)",
};

const mailNote = {
  marginTop: "14px",
  color: "rgba(255,255,255,0.82)",
  fontSize: "0.95rem",
  textAlign: "center",
  lineHeight: "1.7",
};

export default IssueCertificate;