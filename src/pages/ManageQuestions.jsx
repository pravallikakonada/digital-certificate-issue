import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const ManageQuestions = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    course_title: "",
    question_text: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correct_answer: "",
  });
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get("/api/courses/");
      setCourses(response.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchQuestions = async (course) => {
    if (!course) return;
    setLoading(true);
    try {
      const response = await api.get(`/api/exams/questions/${encodeURIComponent(course)}/`);
      setQuestions(response.data || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("Failed to load questions ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (course) => {
    setSelectedCourse(course);
    fetchQuestions(course);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      course_title: selectedCourse,
      question_text: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correct_answer: "",
    });
    setEditingQuestion(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.question_text.trim() || !formData.correct_answer.trim()) {
      alert("Please fill in the question text and correct answer");
      return;
    }

    if (!formData.option1.trim() || !formData.option2.trim() || !formData.option3.trim() || !formData.option4.trim()) {
      alert("Please fill in all four options");
      return;
    }

    const options = [formData.option1, formData.option2, formData.option3, formData.option4];
    if (!options.includes(formData.correct_answer)) {
      alert("Correct answer must be one of the four options");
      return;
    }

    try {
      if (editingQuestion) {
        await api.put(`/api/exams/questions/${editingQuestion.id}/`, formData);
        alert("Question updated successfully ✅");
      } else {
        await api.post("/api/exams/questions/", formData);
        alert("Question added successfully ✅");
      }
      resetForm();
      fetchQuestions(selectedCourse);
    } catch (error) {
      console.error("Error saving question:", error);
      alert("Failed to save question ❌");
    }
  };

  const handleEdit = (question) => {
    setFormData({
      course_title: question.course_title,
      question_text: question.question_text,
      option1: question.option1,
      option2: question.option2,
      option3: question.option3,
      option4: question.option4,
      correct_answer: question.correct_answer,
    });
    setEditingQuestion(question);
    setShowForm(true);
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }

    try {
      await api.delete(`/api/exams/questions/${questionId}/`);
      alert("Question deleted successfully ✅");
      fetchQuestions(selectedCourse);
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Failed to delete question ❌");
    }
  };

  const container = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const content = {
    maxWidth: "1400px",
    margin: "0 auto",
    background: "white",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    overflow: "hidden",
  };

  const header = {
    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    color: "white",
    padding: "40px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
  };

  const headerIcon = {
    fontSize: "3rem",
    background: "rgba(255,255,255,0.2)",
    padding: "20px",
    borderRadius: "16px",
    backdropFilter: "blur(10px)",
  };

  const title = {
    margin: "0 0 8px 0",
    fontSize: "2.5rem",
    fontWeight: "700",
    background: "linear-gradient(45deg, #ffffff, #e0e7ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  const subtitle = {
    margin: "0",
    fontSize: "1.1rem",
    opacity: "0.9",
    fontWeight: "400",
  };

  const courseSelector = {
    padding: "30px 40px",
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
  };

  const selectorCard = {
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
  };

  const selectorTitle = {
    margin: "0 0 20px 0",
    fontSize: "1.4rem",
    fontWeight: "600",
    color: "#1e293b",
  };

  const selectStyle = {
    width: "100%",
    padding: "16px 20px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "16px",
    background: "white",
    color: "#374151",
    fontWeight: "500",
    transition: "all 0.3s ease",
    cursor: "pointer",
  };

  const mainContent = {
    padding: "40px",
  };

  const actionBar = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    padding: "20px",
    background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
    borderRadius: "12px",
    border: "1px solid #0ea5e9",
  };

  const courseBadge = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#0c4a6e",
    background: "white",
    padding: "8px 16px",
    borderRadius: "20px",
    border: "1px solid #0ea5e9",
  };

  const badgeIcon = {
    fontSize: "1.2rem",
  };

  const addButton = {
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "white",
    border: "none",
    padding: "14px 24px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
  };

  const buttonIcon = {
    fontSize: "1.2rem",
  };

  const formModal = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  };

  const formCard = {
    background: "white",
    borderRadius: "20px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
    maxWidth: "700px",
    width: "100%",
    maxHeight: "90vh",
    overflow: "auto",
  };

  const formHeader = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "30px 30px 20px 30px",
    borderBottom: "1px solid #e2e8f0",
  };

  const formTitle = {
    margin: "0",
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#1e293b",
  };

  const closeButton = {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#6b7280",
    padding: "4px",
    borderRadius: "6px",
    transition: "all 0.2s ease",
  };

  const form = {
    padding: "30px",
  };

  const formGroup = {
    marginBottom: "24px",
  };

  const label = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#374151",
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const textareaStyle = {
    width: "100%",
    padding: "16px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "16px",
    minHeight: "100px",
    resize: "vertical",
    fontFamily: "inherit",
    transition: "all 0.3s ease",
    background: "#fafafa",
  };

  const optionsSection = {
    marginBottom: "24px",
  };

  const optionsGrid = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  };

  const optionInput = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const optionBadge = {
    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    color: "white",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "14px",
    flexShrink: 0,
  };

  const inputStyle = {
    flex: 1,
    padding: "12px 16px",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    background: "white",
    transition: "all 0.3s ease",
  };

  const buttonGroup = {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "32px",
  };

  const submitButton = {
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "white",
    border: "none",
    padding: "14px 28px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
  };

  const cancelButton = {
    background: "#f3f4f6",
    color: "#374151",
    border: "2px solid #d1d5db",
    padding: "14px 28px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "all 0.3s ease",
  };

  const questionsSection = {
    marginTop: "30px",
  };

  const sectionHeader = {
    marginBottom: "20px",
  };

  const sectionTitle = {
    margin: "0",
    fontSize: "1.8rem",
    fontWeight: "600",
    color: "#1e293b",
  };

  const loadingState = {
    textAlign: "center",
    padding: "60px",
    color: "#6b7280",
  };

  const spinner = {
    width: "40px",
    height: "40px",
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 20px auto",
  };

  const emptyState = {
    textAlign: "center",
    padding: "80px 40px",
    color: "#6b7280",
  };

  const emptyIcon = {
    fontSize: "4rem",
    marginBottom: "20px",
    opacity: "0.5",
  };

  const questionsGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
    gap: "24px",
  };

  const questionCard = {
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
    transition: "all 0.3s ease",
  };

  const questionHeader = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    borderBottom: "1px solid #e2e8f0",
  };

  const questionMeta = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const questionNumber = {
    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    color: "white",
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
  };

  const questionType = {
    color: "#6b7280",
    fontSize: "14px",
    fontWeight: "500",
  };

  const questionActions = {
    display: "flex",
    gap: "8px",
  };

  const editButton = {
    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.3s ease",
  };

  const deleteButton = {
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.3s ease",
  };

  const questionContent = {
    padding: "24px",
  };

  const questionText = {
    margin: "0 0 16px 0",
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#1e293b",
  };

  const optionsList = {
    marginBottom: "16px",
  };

  const optionItem = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "8px",
  };

  const optionLabel = {
    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    color: "white",
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "12px",
    flexShrink: 0,
  };

  const optionText = {
    color: "#374151",
    fontSize: "14px",
  };

  const correctAnswer = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#059669",
    fontWeight: "600",
  };

  const correctIcon = {
    fontSize: "16px",
  };

  const footer = {
    padding: "30px 40px",
    background: "#f8fafc",
    borderTop: "1px solid #e2e8f0",
    textAlign: "center",
  };

  const backButton = {
    background: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
    color: "white",
    border: "none",
    padding: "14px 28px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(107, 114, 128, 0.3)",
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          select:hover, input:hover, textarea:hover {
            border-color: #3b82f6 !important;
          }
          
          select:focus, input:focus, textarea:focus {
            outline: none;
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
          }
          
          button:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.15) !important;
          }
          
          .question-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
          }
        `}
      </style>
      <div style={container}>
      <div style={content}>
        <div style={header}>
          <div style={headerIcon}>❓</div>
          <div>
            <h1 style={title}>Question Bank</h1>
            <p style={subtitle}>Create and manage exam questions for your courses</p>
          </div>
        </div>

        {/* Course Selection */}
        <div style={courseSelector}>
          <div style={selectorCard}>
            <h3 style={selectorTitle}>📚 Select Course</h3>
            <select
              value={selectedCourse}
              onChange={(e) => handleCourseChange(e.target.value)}
              style={selectStyle}
            >
              <option value="">Choose a course to manage questions...</option>
              {courses.map((course) => (
                <option key={course.id} value={course.title}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedCourse && (
          <div style={mainContent}>
            {/* Action Bar */}
            <div style={actionBar}>
              <div style={courseBadge}>
                <span style={badgeIcon}>🎯</span>
                {selectedCourse}
              </div>
              <button
                onClick={() => {
                  setFormData((prev) => ({ ...prev, course_title: selectedCourse }));
                  setShowForm(true);
                }}
                style={addButton}
              >
                <span style={buttonIcon}>➕</span>
                Add Question
              </button>
            </div>

            {/* Question Form */}
            {showForm && (
              <div style={formModal}>
                <div style={formCard}>
                  <div style={formHeader}>
                    <h3 style={formTitle}>
                      {editingQuestion ? "✏️ Edit Question" : "➕ Create New Question"}
                    </h3>
                    <button onClick={resetForm} style={closeButton}>✕</button>
                  </div>

                  <form onSubmit={handleSubmit} style={form}>
                    <div style={formGroup}>
                      <label style={label}>Question</label>
                      <textarea
                        name="question_text"
                        value={formData.question_text}
                        onChange={handleInputChange}
                        style={textareaStyle}
                        placeholder="Enter your question here..."
                        required
                      />
                    </div>

                    <div style={optionsSection}>
                      <label style={label}>Answer Options</label>
                      <div style={optionsGrid}>
                        <div style={optionInput}>
                          <span style={optionBadge}>A</span>
                          <input
                            type="text"
                            name="option1"
                            value={formData.option1}
                            onChange={handleInputChange}
                            style={inputStyle}
                            placeholder="Option A"
                            required
                          />
                        </div>
                        <div style={optionInput}>
                          <span style={optionBadge}>B</span>
                          <input
                            type="text"
                            name="option2"
                            value={formData.option2}
                            onChange={handleInputChange}
                            style={inputStyle}
                            placeholder="Option B"
                            required
                          />
                        </div>
                        <div style={optionInput}>
                          <span style={optionBadge}>C</span>
                          <input
                            type="text"
                            name="option3"
                            value={formData.option3}
                            onChange={handleInputChange}
                            style={inputStyle}
                            placeholder="Option C"
                            required
                          />
                        </div>
                        <div style={optionInput}>
                          <span style={optionBadge}>D</span>
                          <input
                            type="text"
                            name="option4"
                            value={formData.option4}
                            onChange={handleInputChange}
                            style={inputStyle}
                            placeholder="Option D"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div style={formGroup}>
                      <label style={label}>Correct Answer</label>
                      <select
                        name="correct_answer"
                        value={formData.correct_answer}
                        onChange={handleInputChange}
                        style={selectStyle}
                        required
                      >
                        <option value="">Select the correct answer...</option>
                        <option value={formData.option1}>A: {formData.option1 || "Option A"}</option>
                        <option value={formData.option2}>B: {formData.option2 || "Option B"}</option>
                        <option value={formData.option3}>C: {formData.option3 || "Option C"}</option>
                        <option value={formData.option4}>D: {formData.option4 || "Option D"}</option>
                      </select>
                    </div>

                    <div style={buttonGroup}>
                      <button type="button" onClick={resetForm} style={cancelButton}>
                        Cancel
                      </button>
                      <button type="submit" style={submitButton}>
                        {editingQuestion ? "Update Question" : "Create Question"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Questions List */}
            <div style={questionsSection}>
              <div style={sectionHeader}>
                <h3 style={sectionTitle}>
                  Questions ({questions.length})
                </h3>
              </div>

              {loading ? (
                <div style={loadingState}>
                  <div style={spinner}></div>
                  <p>Loading questions...</p>
                </div>
              ) : questions.length === 0 ? (
                <div style={emptyState}>
                  <div style={emptyIcon}>📝</div>
                  <h4>No questions yet</h4>
                  <p>Start by adding your first question for this course</p>
                </div>
              ) : (
                <div style={questionsGrid}>
                  {questions.map((question, index) => (
                    <div key={question.id} style={questionCard}>
                      <div style={questionHeader}>
                        <div style={questionMeta}>
                          <span style={questionNumber}>#{index + 1}</span>
                          <span style={questionType}>Multiple Choice</span>
                        </div>
                        <div style={questionActions}>
                          <button
                            onClick={() => handleEdit(question)}
                            style={editButton}
                            title="Edit question"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(question.id)}
                            style={deleteButton}
                            title="Delete question"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      <div style={questionContent}>
                        <p style={questionText}>{question.question_text}</p>

                        <div style={optionsList}>
                          <div style={optionItem}>
                            <span style={optionLabel}>A</span>
                            <span style={optionText}>{question.option1}</span>
                          </div>
                          <div style={optionItem}>
                            <span style={optionLabel}>B</span>
                            <span style={optionText}>{question.option2}</span>
                          </div>
                          <div style={optionItem}>
                            <span style={optionLabel}>C</span>
                            <span style={optionText}>{question.option3}</span>
                          </div>
                          <div style={optionItem}>
                            <span style={optionLabel}>D</span>
                            <span style={optionText}>{question.option4}</span>
                          </div>
                        </div>

                        <div style={correctAnswer}>
                          <span style={correctIcon}>✅</span>
                          <strong>Correct Answer:</strong> {question.correct_answer}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div style={footer}>
          <button onClick={() => navigate("/admin-dashboard")} style={backButton}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default ManageQuestions;



const header = {
  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
  color: "white",
  padding: "40px",
  display: "flex",
  alignItems: "center",
  gap: "20px",
};

const headerIcon = {
  fontSize: "3rem",
  background: "rgba(255,255,255,0.2)",
  padding: "20px",
  borderRadius: "16px",
  backdropFilter: "blur(10px)",
};

const title = {
  margin: "0 0 8px 0",
  fontSize: "2.5rem",
  fontWeight: "700",
  background: "linear-gradient(45deg, #ffffff, #e0e7ff)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const subtitle = {
  margin: "0",
  fontSize: "1.1rem",
  opacity: "0.9",
  fontWeight: "400",
};

const courseSelector = {
  padding: "30px 40px",
  background: "#f8fafc",
  borderBottom: "1px solid #e2e8f0",
};

const selectorCard = {
  background: "white",
  padding: "30px",
  borderRadius: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  border: "1px solid #e2e8f0",
};

const selectorTitle = {
  margin: "0 0 20px 0",
  fontSize: "1.4rem",
  fontWeight: "600",
  color: "#1e293b",
};

const selectStyle = {
  width: "100%",
  padding: "16px 20px",
  border: "2px solid #e2e8f0",
  borderRadius: "12px",
  fontSize: "16px",
  background: "white",
  color: "#374151",
  fontWeight: "500",
  transition: "all 0.3s ease",
  cursor: "pointer",
};

const mainContent = {
  padding: "40px",
};

const actionBar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
  padding: "20px",
  background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
  borderRadius: "12px",
  border: "1px solid #0ea5e9",
};

const courseBadge = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "1.1rem",
  fontWeight: "600",
  color: "#0c4a6e",
  background: "white",
  padding: "8px 16px",
  borderRadius: "20px",
  border: "1px solid #0ea5e9",
};

const badgeIcon = {
  fontSize: "1.2rem",
};

const addButton = {
  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  color: "white",
  border: "none",
  padding: "14px 24px",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
};

const buttonIcon = {
  fontSize: "1.2rem",
};

const formModal = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: "20px",
};

const formCard = {
  background: "white",
  borderRadius: "20px",
  boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
  maxWidth: "700px",
  width: "100%",
  maxHeight: "90vh",
  overflow: "auto",
};

const formHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "30px 30px 20px 30px",
  borderBottom: "1px solid #e2e8f0",
};

const formTitle = {
  margin: "0",
  fontSize: "1.5rem",
  fontWeight: "600",
  color: "#1e293b",
};

const closeButton = {
  background: "none",
  border: "none",
  fontSize: "24px",
  cursor: "pointer",
  color: "#6b7280",
  padding: "4px",
  borderRadius: "6px",
  transition: "all 0.2s ease",
};

const form = {
  padding: "30px",
};

const formGroup = {
  marginBottom: "24px",
};

const label = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "600",
  color: "#374151",
  fontSize: "14px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const textareaStyle = {
  width: "100%",
  padding: "16px",
  border: "2px solid #e2e8f0",
  borderRadius: "12px",
  fontSize: "16px",
  minHeight: "100px",
  resize: "vertical",
  fontFamily: "inherit",
  transition: "all 0.3s ease",
  background: "#fafafa",
};

const optionsSection = {
  marginBottom: "24px",
};

const optionsGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",
};

const optionInput = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const optionBadge = {
  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  color: "white",
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  fontSize: "14px",
  flexShrink: 0,
};

const inputStyle = {
  flex: 1,
  padding: "12px 16px",
  border: "2px solid #e2e8f0",
  borderRadius: "8px",
  fontSize: "14px",
  background: "white",
  transition: "all 0.3s ease",
};

const buttonGroup = {
  display: "flex",
  gap: "12px",
  justifyContent: "flex-end",
  marginTop: "32px",
};

const submitButton = {
  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  color: "white",
  border: "none",
  padding: "14px 28px",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "600",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
};

const cancelButton = {
  background: "#f3f4f6",
  color: "#374151",
  border: "2px solid #d1d5db",
  padding: "14px 28px",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "600",
  transition: "all 0.3s ease",
};

const questionsSection = {
  marginTop: "30px",
};

const sectionHeader = {
  marginBottom: "20px",
};

const sectionTitle = {
  margin: "0",
  fontSize: "1.8rem",
  fontWeight: "600",
  color: "#1e293b",
};

const loadingState = {
  textAlign: "center",
  padding: "60px",
  color: "#6b7280",
};

const spinner = {
  width: "40px",
  height: "40px",
  border: "4px solid #e2e8f0",
  borderTop: "4px solid #3b82f6",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  margin: "0 auto 20px auto",
};

const emptyState = {
  textAlign: "center",
  padding: "80px 40px",
  color: "#6b7280",
};

const emptyIcon = {
  fontSize: "4rem",
  marginBottom: "20px",
  opacity: "0.5",
};

const questionsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
  gap: "24px",
};

const questionCard = {
  background: "white",
  borderRadius: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  border: "1px solid #e2e8f0",
  overflow: "hidden",
  transition: "all 0.3s ease",
};

const questionHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 24px",
  background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
  borderBottom: "1px solid #e2e8f0",
};

const questionMeta = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const questionNumber = {
  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  color: "white",
  padding: "4px 12px",
  borderRadius: "12px",
  fontSize: "14px",
  fontWeight: "600",
};

const questionType = {
  color: "#6b7280",
  fontSize: "14px",
  fontWeight: "500",
};

const questionActions = {
  display: "flex",
  gap: "8px",
};

const editButton = {
  background: "#fef3c7",
  color: "#d97706",
  border: "none",
  padding: "8px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
  transition: "all 0.2s ease",
};

const deleteButton = {
  background: "#fee2e2",
  color: "#dc2626",
  border: "none",
  padding: "8px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
  transition: "all 0.2s ease",
};

const questionContent = {
  padding: "24px",
};

const questionText = {
  fontSize: "1.1rem",
  lineHeight: "1.6",
  color: "#1e293b",
  marginBottom: "20px",
  fontWeight: "500",
};

const optionsList = {
  marginBottom: "20px",
};

const optionItem = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "8px 12px",
  marginBottom: "8px",
  background: "#f8fafc",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
};

const optionLabel = {
  background: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
  color: "white",
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  fontWeight: "bold",
  flexShrink: 0,
};

const optionText = {
  color: "#374151",
  fontSize: "14px",
  flex: 1,
};

const correctAnswer = {
  background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1px solid #86efac",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: "#166534",
  fontWeight: "600",
};

const correctIcon = {
  fontSize: "1.2rem",
};

const footer = {
  padding: "30px 40px",
  background: "#f8fafc",
  borderTop: "1px solid #e2e8f0",
  textAlign: "center",
};

const backButton = {
  background: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
  color: "white",
  border: "none",
  padding: "14px 28px",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "600",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 12px rgba(107, 114, 128, 0.3)",
};