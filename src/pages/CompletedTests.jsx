import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const API = "https://certificate-backend-mxjt.onrender.com/api/exams/completed-tests/";

const CompletedTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTests = async () => {
    try {
      const res = await axios.get(API);
      setTests(res.data || []);
    } catch (error) {
      console.error("Error fetching completed tests:", error);
      alert("Completed tests load avvaledu ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleIssueCertificate = (test) => {
    navigate("/issue", {
      state: {
        student_name: test.student_name,
        student_email: test.student_email,
        course_title: test.course_title,
        score: test.score,
        total_questions: test.total_questions,
        result: test.result,
      },
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this completed test?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}${id}/delete/`);
      alert("Completed test deleted successfully ✅");
      fetchTests();
    } catch (error) {
      console.error("Error deleting completed test:", error);
      alert("Delete avvaledu ❌");
    }
  };

  return (
    <>
      <Header />

      <div style={container}>
        <div style={card}>
          <h2 style={title}>Completed Tests</h2>

          {loading ? (
            <p>Loading...</p>
          ) : tests.length === 0 ? (
            <p>No completed tests found.</p>
          ) : (
            tests.map((test) => (
              <div key={test.id} style={testBox}>
                <p><b>Name:</b> {test.student_name}</p>
                <p><b>Email:</b> {test.student_email}</p>
                <p><b>Course:</b> {test.course_title}</p>
                <p><b>Score:</b> {test.score}/{test.total_questions}</p>
                <p><b>Result:</b> {test.result}</p>
                <p><b>Status:</b> {test.status}</p>

                <div style={buttonRow}>
                  {test.result === "Passed" && (
                    <button
                      style={issueBtn}
                      onClick={() => handleIssueCertificate(test)}
                    >
                      Issue Certificate
                    </button>
                  )}

                  <button
                    style={deleteBtn}
                    onClick={() => handleDelete(test.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

const container = {
  minHeight: "100vh",
  background: "#eef4ff",
  padding: "30px",
};

const card = {
  maxWidth: "900px",
  margin: "0 auto",
  background: "#fff",
  padding: "24px",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
};

const title = {
  marginBottom: "20px",
  color: "#1e3a8a",
};

const testBox = {
  border: "1px solid #ddd",
  borderRadius: "12px",
  padding: "16px",
  marginBottom: "16px",
  background: "#f9fafb",
};

const buttonRow = {
  display: "flex",
  gap: "10px",
  marginTop: "14px",
  flexWrap: "wrap",
};

const issueBtn = {
  padding: "10px 16px",
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const deleteBtn = {
  padding: "10px 16px",
  background: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

export default CompletedTests;