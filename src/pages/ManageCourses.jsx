import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";

const API = "https://certificate-backend-mxjt.onrender.com/api/courses/";

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
      alert("Courses fetch avvaledu ❌");
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
      alert("Course save avvaledu ❌");
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
        <div style={card}>
          <h2>Manage Courses</h2>

          <form onSubmit={handleSubmit}>
            <input
              placeholder="Course Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={input}
            />

            <input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={input}
            />

            <button type="submit" style={btn}>
              {editingId ? "Update Course" : "Add Course"}
            </button>
          </form>

          <h3 style={{ marginTop: "30px" }}>Existing Courses</h3>

          {courses.length === 0 ? (
            <p>No courses found.</p>
          ) : (
            courses.map((c) => (
              <div key={c.id} style={courseBox}>
                <div>
                  <b>{c.title}</b>
                  <p>{c.description}</p>
                </div>

                <button onClick={() => handleEdit(c)} style={editBtn}>
                  Edit
                </button>
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
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const card = {
  width: "500px",
  background: "#fff",
  padding: "30px",
  borderRadius: "15px",
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  boxSizing: "border-box",
};

const btn = {
  width: "100%",
  padding: "10px",
  background: "#2563eb",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const courseBox = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px",
  border: "1px solid #ddd",
  marginTop: "10px",
};

const editBtn = {
  background: "#16a34a",
  color: "white",
  border: "none",
  padding: "6px 10px",
  cursor: "pointer",
};

export default ManageCourses;