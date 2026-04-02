import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = `http://${window.location.hostname}:8000`;

const CompletedTests = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/admin-login");
      return;
    }

    fetchCompletedTests();
  }, [navigate]);

  const fetchCompletedTests = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/exams/completed-tests/`);
      setTests(response.data || []);
    } catch (error) {
      console.error("Error fetching completed tests:", error);
      alert("Failed to load completed tests ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleIssueCertificate = (test) => {
    navigate("/issue", {
      state: {
        studentName: test.student_name,
        studentEmail: test.student_email,
        courseTitle: test.course_title,
        status: "Issued",
      },
    });
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
            maxWidth: "1000px",
            margin: "0 auto",
            background: "#fff",
            padding: "30px",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          }}
        >
          <h1 style={{ color: "#1e3a8a", marginTop: 0 }}>Completed Tests</h1>

          {loading ? (
            <p>Loading completed tests...</p>
          ) : tests.length === 0 ? (
            <p>No completed tests found.</p>
          ) : (
            tests.map((test, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  padding: "18px",
                  marginBottom: "16px",
                  background: "#f8fafc",
                }}
              >
                <p><b>Student Name:</b> {test.student_name}</p>
                <p><b>Student Email:</b> {test.student_email}</p>
                <p><b>Course:</b> {test.course_title}</p>
                <p><b>Score:</b> {test.score} / {test.total_questions}</p>
                <p><b>Result:</b> {test.result}</p>
                <p>
                  <b>Certificate Eligibility:</b>{" "}
                  {test.eligible_for_certificate ? "Eligible ✅" : "Not Eligible ❌"}
                </p>
                <p><b>Status:</b> {test.status}</p>

                {test.eligible_for_certificate && (
                  <button
                    onClick={() => handleIssueCertificate(test)}
                    style={{
                      marginTop: "10px",
                      padding: "10px 16px",
                      background: "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Issue Certificate
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default CompletedTests;