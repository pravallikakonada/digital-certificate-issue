import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";

const API = "http://127.0.0.1:8000/api/courses/";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(API);
      setCourses(res.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      alert("Failed to fetch courses");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Enter course title");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API}${editingId}/`, {
          title,
          description,
        });
        alert("Course updated ✅");
      } else {
        await axios.post(API, {
          title,
          description,
        });
        alert("Course added ✅");
      }

      setTitle("");
      setDescription("");
      setEditingId(null);
      fetchCourses();
    } catch (error) {
      console.error("Error saving course:", error);
      alert("Failed to save course");
    }
  };

  const handleEdit = (course) => {
    setTitle(course.title);
    setDescription(course.description);
    setEditingId(course.id);
  };

  return (
    <>
      <Header />

      <div style={container}>
        <div style={pageWrapper}>
          <div style={mainCard}>
            <div style={managementCard}>
              <div style={headerRow}>
                <div>
                  <p style={subTitle}>Course management</p>
                  <h2 style={headingTitle}>Manage Courses</h2>
                </div>

                <div style={editHeader}>
                  <span style={editIcon}>✏️</span>
                  <span style={editLabel}>Manage Courses</span>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <input
                  placeholder="Course Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={input}
                  required
                />

                <textarea
                  placeholder="Course Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={textarea}
                  rows={4}
                />

                <button type="submit" style={btn}>
                  {editingId ? "Update Course" : "Add Course"}
                </button>
              </form>
            </div>

            <div style={existingCard}>
              <div style={existingHeaderRow}>
                <div>
                  <p style={subTitle}>Existing Courses</p>
                  <h3 style={existingTitle}>Course catalog</h3>
                </div>
                <span style={existingLabel}>Editable list</span>
              </div>

              {courses.length === 0 ? (
                <p style={emptyText}>No courses found.</p>
              ) : (
                courses.map((c) => (
                  <div key={c.id} style={courseBox}>
                    <div style={courseInfo}>
                      <div style={courseHeaderRow}>
                        <span style={courseBadge}>Course</span>
                        <span style={courseTag}>Editable</span>
                      </div>
                      <h4 style={courseTitle}>{c.title}</h4>
                      <p style={courseDescription}>{c.description}</p>
                    </div>

                    <button type="button" onClick={() => handleEdit(c)} style={editBtn}>
                      <span style={editBtnIcon}>✎</span> Edit
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const container = {
  minHeight: "100vh",
  width: "100vw",
  padding: "32px 18px",
  background: "#f3f4f6",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  boxSizing: "border-box",
};

const pageWrapper = {
  width: "min(980px, 100%)",
  display: "grid",
  gap: "22px",
};

const mainCard = {
  width: "100%",
  display: "grid",
  gap: "18px",
};

const managementCard = {
  background: "#ffffff",
  padding: "28px",
  borderRadius: "20px",
  border: "1px solid #e5e7eb",
};

const existingCard = {
  background: "#ffffff",
  padding: "28px",
  borderRadius: "20px",
  border: "1px solid #e5e7eb",
};

const existingHeaderRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  marginBottom: "20px",
};

const existingTitle = {
  margin: "8px 0 0",
  fontSize: "24px",
  color: "#0f172a",
};

const existingLabel = {
  padding: "8px 14px",
  borderRadius: "999px",
  background: "#e0f2fe",
  color: "#1d4ed8",
  fontWeight: 700,
  fontSize: "13px",
};

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  marginBottom: "28px",
};

const subTitle = {
  margin: 0,
  fontSize: "14px",
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.12em",
};

const headingTitle = {
  margin: "8px 0 0",
  fontSize: "28px",
  color: "#0f172a",
};

const editHeader = {
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  borderRadius: "999px",
  padding: "10px 16px",
  color: "#1d4ed8",
  fontWeight: 600,
};

const editIcon = {
  fontSize: "18px",
};

const editLabel = {
  whiteSpace: "nowrap",
};

const input = {
  width: "100%",
  padding: "12px 14px",
  marginBottom: "12px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  outline: "none",
  fontSize: "15px",
  background: "#ffffff",
  color: "#111827",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const textarea = {
  width: "100%",
  padding: "12px 14px",
  marginBottom: "12px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  outline: "none",
  fontSize: "15px",
  background: "#ffffff",
  color: "#111827",
  boxSizing: "border-box",
  resize: "vertical",
  minHeight: "80px",
};

const btn = {
  width: "100%",
  padding: "12px 14px",
  background: "#4338ca",
  color: "#ffffff",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "15px",
  transition: "background-color 0.2s",
};

const courseBox = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
  padding: "16px 18px",
  borderRadius: "16px",
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  marginTop: "12px",
};

const courseInfo = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const courseHeaderRow = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  flexWrap: "wrap",
};

const courseBadge = {
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#eef2ff",
  color: "#4338ca",
  fontSize: "12px",
  fontWeight: 700,
};

const courseTag = {
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#f3f4f6",
  color: "#6b7280",
  fontSize: "12px",
};

const editBtn = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  background: "#1d4ed8",
  color: "white",
  border: "none",
  borderRadius: "14px",
  padding: "12px 16px",
  cursor: "pointer",
  fontWeight: 700,
  transition: "background 0.2s ease, transform 0.2s ease",
};

const editBtnIcon = {
  fontSize: "14px",
};

const courseTitle = {
  margin: 0,
  fontSize: "18px",
  color: "#0f172a",
};

const courseDescription = {
  margin: "6px 0 0",
  color: "#475569",
  fontSize: "14px",
  lineHeight: 1.8,
  maxWidth: "68ch",
};

const emptyText = {
  color: "#64748b",
  marginTop: "12px",
};

export default ManageCourses;