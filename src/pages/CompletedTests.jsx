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

  const handleIssueCertificate = (student) => {
    navigate("/issue", {
      state: {
        student_name: student.student_name,
        student_email: student.student_email,
        course_title: student.course_title,
        score: student.score,
        total_questions: student.total_questions,
        result: student.result,
      },
    });
  };

  return (
    <>
      <Header />

      <div style={container}>
        <div style={card}>
          <h2>Completed Tests</h2>

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

                {test.result === "Passed" && (
                  <button
                    onClick={() =>
  navigate("/issue", {
    state: {
      student_name: test.student_name,
      student_email: test.student_email,
      course_title: test.course_title,
    },
  })
}>
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

const testBox = {
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "16px",
  marginBottom: "15px",
};

const btn = {
  marginTop: "10px",
  padding: "10px 16px",
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

export default CompletedTests;