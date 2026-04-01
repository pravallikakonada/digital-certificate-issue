import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";

const MyCertificates = () => {
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/certificates/"
      );
      setCertificates(response.data);
    } catch (error) {
      console.error("Error fetching certificates", error);
    }
  };

  return (
    <>
      <Header />

      <div style={{ padding: "30px", background: "#f3f6ff", minHeight: "100vh" }}>
        <h1 style={{ textAlign: "center", color: "#1e3a8a" }}>
          My Certificates
        </h1>

        {certificates.length === 0 ? (
          <p style={{ textAlign: "center" }}>No certificates found</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
              marginTop: "30px",
            }}
          >
            {certificates.map((cert, index) => (
              <div
                key={index}
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "15px",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                }}
              >
                <h3 style={{ color: "#2563eb" }}>{cert.student_name}</h3>
                <p><b>Email:</b> {cert.student_email}</p>
                <p><b>Course:</b> {cert.course_title}</p>
                <p><b>ID:</b> {cert.certificate_id}</p>
                <p><b>Status:</b> {cert.status}</p>

                <button
                  style={{
                    marginTop: "10px",
                    padding: "10px",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    window.open(
                      `/verify?certificateId=${cert.certificate_id}`
                    )
                  }
                >
                  View / Verify
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyCertificates;