import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://192.168.29.45:8000";

const TakeTest = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("studentEmail");

    const params = new URLSearchParams(window.location.search);
    const name = params.get("name") || "";
    const email = params.get("email") || "";
    const course = params.get("course") || "";

    if (!storedEmail) {
      window.location.href =
        `${window.location.origin}/auth-exam` +
        `?name=${encodeURIComponent(name)}` +
        `&email=${encodeURIComponent(email)}` +
        `&course=${encodeURIComponent(course)}`;
      return;
    }

    setStudentName(name);
    setStudentEmail(email);
    setCourseTitle(course);

    if (course) {
      axios
        .get(
          `${API_BASE_URL}/api/exams/questions/?course=${encodeURIComponent(
            course
          )}`
        )
        .then((response) => {
          console.log("Questions API response:", response.data);
          setQuestions(response.data);
        })
        .catch((error) => {
          console.error("Error fetching questions:", error);
          alert("Failed to load questions ❌");
        });
    }
  }, []);

  const handleOptionChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    let score = 0;
    const questionResults = [];

    questions.forEach((q) => {
      const selectedRaw = answers[q.id] || "";
      const correctRaw = q.correct_answer || "";

      const selected = selectedRaw.trim().toLowerCase();
      const correct = correctRaw.trim().toLowerCase();

      const isCorrect = selected === correct;

      if (isCorrect) {
        score += 1;
      }

      questionResults.push({
        question_id: q.id,
        question_text: q.question_text,
        selected_answer: selectedRaw || "Not Answered",
        correct_answer: correctRaw,
        is_correct: isCorrect,
      });
    });

    const finalResult = score >= 3 ? "Passed" : "Failed";
    const eligible = score >= 3;

    try {
      await axios.post(`${API_BASE_URL}/api/exams/submit-exam/`, {
        student_name: studentName,
        student_email: studentEmail,
        course_title: courseTitle,
        score: score,
        total_questions: questions.length,
      });

      setResultData({
        score,
        total_questions: questions.length,
        result: finalResult,
        eligible_for_certificate: eligible,
        questionResults,
      });

      alert("Test completed successfully ✅\nPlease wait for next process.");
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
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "white",
          padding: "30px",
          borderRadius: "18px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ color: "#1e3a8a", marginTop: 0 }}>Take Test</h1>

        <p>
          <b>Name:</b> {studentName}
        </p>
        <p>
          <b>Email:</b> {studentEmail}
        </p>
        <p>
          <b>Course:</b> {courseTitle}
        </p>
        <p>
          <b>Cutoff:</b> 3 correct answers for certificate eligibility
        </p>

        {questions.length === 0 ? (
          <p>No questions found for this course.</p>
        ) : (
          <>
            {questions.map((q, index) => (
              <div
                key={q.id}
                style={{
                  marginBottom: "24px",
                  padding: "18px",
                  background: "#f9fafb",
                  borderRadius: "12px",
                }}
              >
                <p style={{ fontWeight: "600" }}>
                  Q{index + 1}. {q.question_text}
                </p>

                {[q.option1, q.option2, q.option3, q.option4].map(
                  (option, i) => (
                    <div key={i} style={{ marginBottom: "6px" }}>
                      <label>
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          value={option}
                          checked={answers[q.id] === option}
                          onChange={(e) =>
                            handleOptionChange(q.id, e.target.value)
                          }
                        />{" "}
                        {option}
                      </label>
                    </div>
                  )
                )}
              </div>
            ))}

            <button
              onClick={handleSubmit}
              style={{
                padding: "12px 20px",
                background: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Submit Test
            </button>
          </>
        )}

        {resultData && (
          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              borderRadius: "14px",
              background: "#f8fafc",
              border: "1px solid #dbeafe",
            }}
          >
            <h2 style={{ color: "#1e3a8a" }}>Exam Result</h2>
            <p>
              <b>Score:</b> {resultData.score} / {resultData.total_questions}
            </p>
            <p>
              <b>Result:</b> {resultData.result}
            </p>
            <p>
              <b>Certificate Eligibility:</b>{" "}
              {resultData.eligible_for_certificate
                ? "Eligible ✅"
                : "Not Eligible ❌"}
            </p>

            <h3 style={{ marginTop: "20px" }}>Question-wise Result</h3>

            {resultData.questionResults.map((item, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "14px",
                  padding: "14px",
                  borderRadius: "10px",
                  background: item.is_correct ? "#ecfdf5" : "#fef2f2",
                  border: item.is_correct
                    ? "1px solid #86efac"
                    : "1px solid #fca5a5",
                }}
              >
                <p>
                  <b>Q:</b> {item.question_text}
                </p>
                <p>
                  <b>Your Answer:</b> {item.selected_answer}
                </p>
                <p>
                  <b>Correct Answer:</b> {item.correct_answer}
                </p>
                <p>
                  <b>Status:</b> {item.is_correct ? "Correct ✅" : "Wrong ❌"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TakeTest;