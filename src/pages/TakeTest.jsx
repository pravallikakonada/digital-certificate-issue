import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://certificate-backend-mxjt.onrender.com";

const TakeTest = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const name = params.get("name") || "";
    const email = params.get("email") || "";
    let course = params.get("course") || "";

    // QUICK FIX: old mail links ni correct course name ki map cheyyadam
    if (course.trim().toLowerCase() === "python") {
      course = "Python Programming";
    }
    if (course.trim().toLowerCase() === "react") {
      course = "React Frontend Development";
    }
    if (course.trim().toLowerCase() === "full stack") {
      course = "Full Stack Web Development";
    }

    setStudentName(name);
    setStudentEmail(email);
    setCourseTitle(course);

    const fetchQuestions = async () => {
      try {
        if (!course) {
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${API_BASE_URL}/api/exams/questions/${encodeURIComponent(course)}/`
        );

        setQuestions(response.data || []);
      } catch (error) {
        console.error("Error fetching questions:", error);
        alert("Failed to load questions ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleOptionChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    let score = 0;

    questions.forEach((q) => {
      const selectedRaw = answers[q.id] || "";
      const correctRaw = q.correct_answer || "";

      const selected = selectedRaw.trim().toLowerCase();
      const correct = correctRaw.trim().toLowerCase();

      if (selected === correct) {
        score += 1;
      }
    });

    const finalResult = score >= 3 ? "Passed" : "Failed";

    try {
      await axios.post(`${API_BASE_URL}/api/exams/submit-exam/`, {
        student_name: studentName,
        student_email: studentEmail,
        course_title: courseTitle,
        score: score,
        total_questions: questions.length,
      });

      alert(
        `Test completed successfully ✅\nScore: ${score}/${questions.length}\nResult: ${finalResult}`
      );

      navigate("/student-dashboard");
    } catch (error) {
      console.error("Error submitting exam:", error);
      alert("Failed to submit exam ❌");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f6ff",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "white",
          padding: "24px",
          borderRadius: "18px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ color: "#1e3a8a", marginTop: 0 }}>Take Test</h1>

        <p><b>Name:</b> {studentName}</p>
        <p><b>Email:</b> {studentEmail}</p>
        <p><b>Course:</b> {courseTitle}</p>
        <p><b>Cutoff:</b> 3 correct answers for certificate eligibility</p>

        {loading ? (
          <p>Loading questions...</p>
        ) : questions.length === 0 ? (
          <p>No questions found for this course.</p>
        ) : (
          <>
            {questions.map((q, index) => (
              <div
                key={q.id}
                style={{
                  marginBottom: "20px",
                  padding: "16px",
                  background: "#f9fafb",
                  borderRadius: "12px",
                }}
              >
                <p style={{ fontWeight: "600", lineHeight: "1.6" }}>
                  Q{index + 1}. {q.question_text}
                </p>

                {[q.option1, q.option2, q.option3, q.option4].map((option, i) => (
                  <div key={i} style={{ marginBottom: "8px" }}>
                    <label style={{ lineHeight: "1.6" }}>
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={option}
                        checked={answers[q.id] === option}
                        onChange={(e) =>
                          handleOptionChange(q.id, e.target.value)
                        }
                      />
                      {" "}{option}
                    </label>
                  </div>
                ))}
              </div>
            ))}

            <button
              onClick={handleSubmit}
              style={{
                width: "100%",
                padding: "14px 20px",
                background: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "16px",
              }}
            >
              Submit Test
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TakeTest;