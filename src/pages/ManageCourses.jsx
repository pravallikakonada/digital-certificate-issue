import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";

const API = "http://127.0.0.1:8000/api/courses/";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
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

  const filteredCourses = courses.filter((course) => {
    const searchText = search.trim().toLowerCase();
    if (!searchText) return true;
    return (
      course.title.toLowerCase().includes(searchText) ||
      (course.description || "").toLowerCase().includes(searchText)
    );
  });

  return (
    <>
      <Header />
      <style>
        {`
          @keyframes slideInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          input:focus, textarea:focus {
            outline: none;
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
        `}
      </style>
      <div style={container}>
        <div style={contentWrapper}>
          <div style={headerSection}>
            <h1 style={pageTitle}>Manage Courses</h1>
            <p style={pageSubtitle}>Add, edit, and organize your course catalog</p>
          </div>

          <div style={twoColumnLayout}>
            <div style={formSection}>
              <div style={formHeader}>
                <h2 style={formTitle}>{editingId ? "Edit Course" : "Add New Course"}</h2>
                <span style={formBadge}>{editingId ? "📝 Update" : "✨ Create"}</span>
              </div>

              <form onSubmit={handleSubmit} style={form}>
                <div style={formGroup}>
                  <label style={label}>Course Title</label>
                  <input
                    placeholder="e.g., Python Fundamentals"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={input}
                    required
                  />
                </div>

                <div style={formGroup}>
                  <label style={label}>Description</label>
                  <textarea
                    placeholder="Enter course description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={textarea}
                    rows={5}
                  />
                </div>

                <button type="submit" style={btn}>
                  <span style={{ marginRight: "8px" }}>{editingId ? "📝" : "➕"}</span>
                  {editingId ? "Update Course" : "Add Course"}
                </button>
              </form>
            </div>

            <div style={coursesSection}>
              <div style={coursesHeader}>
                <div>
                  <h2 style={coursesTitle}>Course Catalog</h2>
                  <p style={coursesSubtitle}>Search, edit, and review published courses.</p>
                </div>
                <span style={coursesCount}>{filteredCourses.length} / {courses.length}</span>
              </div>

              <div style={searchWrapper}>
                <input
                  type="search"
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={searchInput}
                />
              </div>

              {filteredCourses.length === 0 ? (
                <div style={emptyState}>
                  <div style={emptyIcon}>🔎</div>
                  <p style={emptyText}>
                    {courses.length === 0
                      ? "No courses yet. Create one to get started!"
                      : "No courses match your search."}
                  </p>
                </div>
              ) : (
                <div style={coursesList}>
                  {filteredCourses.map((c, idx) => (
                    <div key={c.id} style={{...courseCard, animation: `slideInUp 0.5s ease-out ${idx * 0.08}s both`}}>
                      <div style={courseBody}>
                        <div style={courseMeta}>
                          <span style={courseBadge}>📘 Course</span>
                          <span style={courseStatus}>Active</span>
                        </div>
                        <h3 style={courseTitle}>{c.title}</h3>
                        <p style={courseDescription}>{c.description || "No description provided"}</p>
                      </div>

                      <button type="button" onClick={() => handleEdit(c)} style={editBtn}>
                        <span style={{ fontSize: "16px", marginRight: "6px" }}>✏️</span>
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
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
  background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)",
  padding: "60px 20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  boxSizing: "border-box",
};

const contentWrapper = {
  width: "min(1200px, 100%)",
  display: "flex",
  flexDirection: "column",
  gap: "40px",
};

const headerSection = {
  textAlign: "center",
  animation: "slideInUp 0.8s ease-out",
};

const pageTitle = {
  fontSize: "48px",
  fontWeight: "800",
  color: "white",
  margin: 0,
  marginBottom: "12px",
  letterSpacing: "-0.5px",
};

const pageSubtitle = {
  fontSize: "16px",
  color: "rgba(255, 255, 255, 0.85)",
  margin: 0,
};

const twoColumnLayout = {
  display: "grid",
  gridTemplateColumns: window.innerWidth <= 900 ? "1fr" : "1fr 1.2fr",
  gap: "32px",
  animation: "slideInUp 0.8s ease-out 0.1s both",
};

const formSection = {
  background: "white",
  borderRadius: "16px",
  padding: "32px",
  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.15)",
};

const formHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "28px",
  paddingBottom: "16px",
  borderBottom: "1px solid #e5e7eb",
};

const formTitle = {
  fontSize: "22px",
  fontWeight: "700",
  color: "#1f2937",
  margin: 0,
};

const formBadge = {
  display: "inline-block",
  background: "#e0f2fe",
  color: "#0369a1",
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};

const formGroup = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const label = {
  fontSize: "13px",
  fontWeight: "600",
  color: "#1f2937",
};

const coursesSection = {
  background: "white",
  borderRadius: "16px",
  padding: "32px",
  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.15)",
};

const coursesHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "28px",
  paddingBottom: "16px",
  borderBottom: "1px solid #e5e7eb",
};

const coursesTitle = {
  fontSize: "22px",
  fontWeight: "700",
  color: "#1f2937",
  margin: 0,
};

const coursesCount = {
  display: "inline-block",
  background: "#fef3c7",
  color: "#92400e",
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
};

const coursesSubtitle = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "4px 0 0 0",
};

const searchWrapper = {
  marginBottom: "24px",
};

const searchInput = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  color: "#111827",
  background: "#f8fafc",
  boxSizing: "border-box",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const coursesList = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const courseCard = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
  padding: "24px",
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  transition: "all 0.3s ease",
};

const courseBody = {
  flex: 1,
};

const courseMeta = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "12px",
};

const courseBadge = {
  padding: "4px 10px",
  borderRadius: "20px",
  background: "#fef3c7",
  color: "#92400e",
  fontSize: "12px",
  fontWeight: "700",
};

const courseStatus = {
  padding: "4px 10px",
  borderRadius: "20px",
  background: "#d1fae5",
  color: "#065f46",
  fontSize: "12px",
  fontWeight: "600",
};

const courseTitle = {
  margin: "0 0 8px 0",
  fontSize: "18px",
  fontWeight: "700",
  color: "#1f2937",
};

const courseDescription = {
  margin: 0,
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "1.6",
};

const input = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  background: "white",
  color: "#111827",
  boxSizing: "border-box",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const textarea = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  background: "white",
  color: "#111827",
  boxSizing: "border-box",
  resize: "vertical",
  fontFamily: "inherit",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const btn = {
  width: "100%",
  padding: "12px 16px",
  background: "linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const editBtn = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  background: "linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "10px 16px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
  transition: "all 0.3s ease",
  whiteSpace: "nowrap",
};

const emptyState = {
  textAlign: "center",
  padding: "60px 20px",
};

const emptyIcon = {
  fontSize: "48px",
  marginBottom: "16px",
};

const emptyText = {
  color: "#6b7280",
  fontSize: "16px",
  margin: 0,
};

export default ManageCourses;