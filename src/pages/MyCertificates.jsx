import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";

const API = "https://certificate-backend-mxjt.onrender.com/api/certificates/";

const MyCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const studentEmail = localStorage.getItem("studentEmail");

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.get(API);
        const allCertificates = response.data || [];

        const myCertificates = allCertificates.filter(
          (cert) => cert.student_email === studentEmail
        );

        setCertificates(myCertificates);
      } catch (error) {
        console.error("Error fetching certificates:", error);
        alert("Certificates load avvaledu ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [studentEmail]);

  const handleDownload = (cert) => {
    const content = `
Digital Certificate
Certificate of Completion

Student Name: ${cert.student_name}
Student Email: ${cert.student_email}
Course Name: ${cert.course_title}
Certificate ID: ${cert.certificate_id}
Status: ${cert.status}

This certificate is digitally generated and verified.
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${cert.certificate_id}.txt`;
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <Header />

      <div style={container}>
        <div style={card}>
          <h2>My Certificates</h2>

          {loading ? (
            <p>Loading...</p>
          ) : certificates.length === 0 ? (
            <p>No certificates found.</p>
          ) : (
            certificates.map((cert) => (
              <div key={cert.certificate_id} style={certBox}>
                <p><b>Name:</b> {cert.student_name}</p>
                <p><b>Email:</b> {cert.student_email}</p>
                <p><b>Course:</b> {cert.course_title}</p>
                <p><b>Certificate ID:</b> {cert.certificate_id}</p>
                <p><b>Status:</b> {cert.status}</p>

                <button
                  style={btn}
                  onClick={() => handleDownload(cert)}
                >
                  Download Certificate
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

const certBox = {
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "16px",
  marginBottom: "15px",
};

const btn = {
  marginTop: "10px",
  padding: "10px 16px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

export default MyCertificates;