import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";


const TakeTest = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [submitted, setSubmitted] = useState(false);
  const [submissionSummary, setSubmissionSummary] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasExamData, setHasExamData] = useState(false);

  // Load exam details from localStorage on mount
  useEffect(() => {
    const examName = localStorage.getItem('examName');
    const examEmail = localStorage.getItem('examEmail');
    const examCourse = localStorage.getItem('examCourse');

    if (examName && examEmail && examCourse) {
      setStudentName(examName);
      setStudentEmail(examEmail);
      setCourseTitle(examCourse);
      setHasExamData(true);
    }
  }, []);

  const normalizeCourseTitle = (course) => {
    const value = (course || "").trim().toLowerCase();

    const courseMap = {
      python: "Python Programming",
      "python programming": "Python Programming",

      react: "React Frontend Development",
      "react frontend development": "React Frontend Development",

      full: "Full Stack Web Development",
      "full stack": "Full Stack Web Development",
      "full stack web development": "Full Stack Web Development",
    };

    return courseMap[value] || course;
  };

  const fetchQuestions = async (course = courseTitle) => {
    const trimmedCourse = (course || "").trim();
    if (!trimmedCourse) {
      setQuestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(
        `/api/exams/questions/${encodeURIComponent(trimmedCourse)}/`,
        {
          params: {
            email: studentEmail.trim(),
            limit: 5,
          },
        }
      );

      setQuestions(response.data || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("Failed to load questions ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading || submitted) return;
    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, submitted, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartTest = () => {
    if (!studentName.trim() || !studentEmail.trim() || !courseTitle.trim()) {
      alert("Please fill in all fields.");
      return;
    }
    const normalizedCourse = normalizeCourseTitle(courseTitle);
    setCourseTitle(normalizedCourse);
    setStartedAt(new Date().toISOString());
    fetchQuestions(normalizedCourse);
  };

  const handleOptionChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const buildSummary = () => {
    let score = 0;

    const details = questions.map((q) => {
      const selectedRaw = answers[q.id] || "";
      const correctRaw = q.correct_answer || "";
      const selected = selectedRaw.trim().toLowerCase();
      const correct = correctRaw.trim().toLowerCase();
      const isCorrect = selected === correct;

      if (isCorrect) {
        score += 1;
      }

      return {
        id: q.id,
        questionText: q.question_text,
        selectedAnswer: selectedRaw || "No answer",
        correctAnswer: correctRaw || "",
        isCorrect,
      };
    });

    return {
      score,
      totalQuestions: questions.length,
      finalResult: score >= 3 ? "Passed" : "Failed",
      details,
    };
  };

  const handleSubmit = async (isAutoSubmit = false) => {
    if (submitted || isSubmitting) return;
    setIsSubmitting(true);

    const summary = buildSummary();
    setSubmissionSummary(summary);
    setSubmitted(true);

    try {
      await api.post(`/api/exams/submit-exam/`, {
        student_name: studentName,
        student_email: studentEmail,
        course_title: courseTitle,
        score: summary.score,
        total_questions: summary.totalQuestions,
        result: summary.finalResult,
        started_at: startedAt,
      });
    } catch (error) {
      console.error("Error submitting exam:", error);
      alert("Failed to submit exam ❌");
    } finally {
      setIsSubmitting(false);
    }

    // Clear localStorage after successful submission
    localStorage.removeItem('examName');
    localStorage.removeItem('examEmail');
    localStorage.removeItem('examCourse');

    if (!isAutoSubmit) {
      alert(
        `Test completed ✅\nScore: ${summary.score}/${summary.totalQuestions}\nResult: ${summary.finalResult}`
      );
    }
  };

  const handleBackToDashboard = () => {
    // Clear localStorage when leaving test page
    localStorage.removeItem('examName');
    localStorage.removeItem('examEmail');
    localStorage.removeItem('examCourse');
    navigate("/student-dashboard");
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
        {!startedAt ? (
          <>
            <h1 style={{ color: "#1e3a8a", marginTop: 0 }}>Take Test</h1>
            {hasExamData ? (
              <>
                <div style={{ marginBottom: "20px", padding: "16px", background: "#f0f9ff", borderRadius: "8px", border: "1px solid #0ea5e9" }}>
                  <p style={{ margin: "8px 0" }}><b>Name:</b> {studentName}</p>
                  <p style={{ margin: "8px 0" }}><b>Email:</b> {studentEmail}</p>
                  <p style={{ margin: "8px 0" }}><b>Course:</b> {courseTitle}</p>
                </div>
                <button
                  onClick={handleStartTest}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "14px 20px",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    fontSize: "16px",
                  }}
                >
                  {loading ? "Loading..." : "Start Test Now"}
                </button>
              </>
            ) : (
              <>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "5px" }}>Name:</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      fontSize: "16px",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "5px" }}>Email:</label>
                  <input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      fontSize: "16px",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "5px" }}>Course:</label>
                  <input
                    type="text"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="e.g., Python Programming"
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      fontSize: "16px",
                    }}
                  />
                </div>
                <button
                  onClick={handleStartTest}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "14px 20px",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    fontSize: "16px",
                  }}
                >
                  {loading ? "Loading..." : "Start Test"}
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <h1 style={{ color: "#1e3a8a", marginTop: 0 }}>Take Test</h1>

            <p><b>Name:</b> {studentName}</p>
            <p><b>Email:</b> {studentEmail}</p>
            <p><b>Course:</b> {courseTitle}</p>
            <p><b>Cutoff:</b> 3 correct answers for certificate eligibility</p>
            {!submitted && (
              <p style={{ fontWeight: 600, color: "#0f172a" }}>
                Time remaining: {formatTime(timeLeft)}
              </p>
            )}

            {loading ? (
              <p>Loading questions...</p>
            ) : questions.length === 0 ? (
              <p>No questions found for this course.</p>
            ) : submitted && submissionSummary ? (
              <div>
                <div
                  style={{
                    padding: "18px",
                    background: "#eef2ff",
                    borderRadius: "12px",
                    marginBottom: "20px",
                  }}
                >
                  <p style={{ margin: 0, fontWeight: 700 }}>
                    {submissionSummary.finalResult === "Passed"
                      ? "Congratulations! You passed."
                      : "You did not pass this time."}
                  </p>
                  <p style={{ margin: "8px 0 0" }}>
                    Score: {submissionSummary.score}/{submissionSummary.totalQuestions}
                  </p>
                  <p style={{ margin: "8px 0 0", color: "#475569" }}>
                    {timeLeft <= 0
                      ? "Time expired and your answers were submitted automatically."
                      : "Your answers have been submitted."}
                  </p>
                </div>

                {submissionSummary.details.map((item, index) => (
                  <div
                    key={item.id}
                    style={{
                      marginBottom: "18px",
                      padding: "18px",
                      background: item.isCorrect ? "#ecfdf5" : "#f8d7da",
                      borderRadius: "12px",
                      border: item.isCorrect ? "1px solid #34d399" : "1px solid #f87171",
                    }}
                  >
                    <p style={{ fontWeight: 600, marginBottom: "10px" }}>
                      Q{index + 1}. {item.questionText}
                    </p>
                    <p style={{ margin: "4px 0" }}>
                      <strong>Your answer:</strong> {item.selectedAnswer}
                    </p>
                    <p style={{ margin: "4px 0" }}>
                      <strong>Correct answer:</strong> {item.correctAnswer}
                    </p>
                    <p style={{ margin: "4px 0", fontWeight: 700 }}>
                      {item.isCorrect ? "Correct ✅" : "Incorrect ❌"}
                    </p>
                  </div>
                ))}

                <button
                  onClick={handleBackToDashboard}
                  style={{
                    width: "100%",
                    padding: "14px 20px",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "16px",
                  }}
                >
                  Back to Dashboard
                </button>
              </div>
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
                            onChange={(e) => handleOptionChange(q.id, e.target.value)}
                          />
                          {" "}{option}
                        </label>
                      </div>
                    ))}
                  </div>
                ))}

                <button
                  onClick={() => handleSubmit(false)}
                  disabled={isSubmitting}
                  style={{
                    width: "100%",
                    padding: "14px 20px",
                    background: "#16a34a",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    opacity: isSubmitting ? 0.7 : 1,
                    fontWeight: "600",
                    fontSize: "16px",
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Submit Test"}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TakeTest;