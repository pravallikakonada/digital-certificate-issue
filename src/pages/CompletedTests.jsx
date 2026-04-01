import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://192.168.29.45:8000";

const CompletedTests = () => {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/exams/completed-tests/`)
      .then((res) => setTests(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleIssue = (test) => {
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
    <div style={{ padding: "30px" }}>
      <h1>Completed Tests</h1>

      {tests.map((t, i) => (
        <div key={i} style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "15px" }}>
          <h3 style={{ color: "green" }}>
            {t.student_name} completed the test successfully ✅
          </h3>

          <p>Name: {t.student_name}</p>
          <p>Email: {t.student_email}</p>
          <p>Course: {t.course_title}</p>
          <p>Score: {t.score}</p>
          <p>Result: {t.result}</p>

          {t.eligible_for_certificate && (
            <button onClick={() => handleIssue(t)}>
              Issue Certificate
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default CompletedTests;