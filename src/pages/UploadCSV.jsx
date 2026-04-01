import { useState } from "react";
import Header from "../components/Header";
import { uploadCSV } from "../services/certificateService.js";

const UploadCSV = () => {
  const [file, setFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadCSV(formData);
      alert("CSV uploaded successfully ✅");
      setFile(null);
    } catch (error) {
      console.error(error);
      alert("CSV upload failed ❌");
    }
  };

  return (
    <>
      <Header />

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
            maxWidth: "700px",
            margin: "0 auto",
            background: "white",
            padding: "30px",
            borderRadius: "18px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          }}
        >
          <h1 style={{ marginTop: 0, color: "#1e3a8a" }}>Upload CSV</h1>

          <form onSubmit={handleUpload}>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ marginBottom: "20px" }}
            />

            <br />

            <button
              type="submit"
              style={{
                padding: "12px 20px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Upload CSV
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UploadCSV;