import React from "react";
import Header from "../components/Header";

const Home = () => {
  return (
    <>
      <Header />

      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #eef4ff, #f8fbff)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "30px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "950px",
            width: "100%",
            background: "#fff",
            borderRadius: "20px",
            padding: "50px",
            boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "46px",
              color: "#1e3a8a",
              marginTop: 0,
              marginBottom: "20px",
            }}
          >
            Digital Certificate Issuance and Verification System
          </h1>

          <p
            style={{
              fontSize: "19px",
              color: "#4b5563",
              lineHeight: "1.8",
              marginBottom: "30px",
            }}
          >
            A secure web application to conduct online exams, issue digital
            certificates, and verify certificate authenticity using a unique
            certificate ID.
          </p>

          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a href="/admin-login" style={btnPrimary}>Admin Login</a>
            <a href="/student-login" style={btnSecondary}>Student Login</a>
            
            <a href="/verify" style={btnSecondary}>Verify Certificate</a>
          </div>

          <div
            style={{
              marginTop: "40px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
              textAlign: "left",
            }}
          >
            <div style={featureCard}>
              <h3 style={featureTitle}>Admin Module</h3>
              <p style={featureText}>
                Send exam mail, monitor completed tests, and issue certificates.
              </p>
            </div>

            <div style={featureCard}>
              <h3 style={featureTitle}>Student Module</h3>
              <p style={featureText}>
                Login, take exams, and view issued certificates securely.
              </p>
            </div>

            <div style={featureCard}>
              <h3 style={featureTitle}>Verification Module</h3>
              <p style={featureText}>
                Verify certificate validity using certificate ID.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const btnPrimary = {
  background: "#2563eb",
  color: "white",
  textDecoration: "none",
  padding: "12px 22px",
  borderRadius: "10px",
  fontWeight: "600",
};

const btnSecondary = {
  background: "#e5e7eb",
  color: "#111827",
  textDecoration: "none",
  padding: "12px 22px",
  borderRadius: "10px",
  fontWeight: "600",
};

const featureCard = {
  background: "#f8fafc",
  borderRadius: "14px",
  padding: "20px",
  border: "1px solid #e5e7eb",
};

const featureTitle = {
  marginTop: 0,
  color: "#1e3a8a",
};

const featureText = {
  marginBottom: 0,
  color: "#4b5563",
  lineHeight: "1.6",
};

export default Home;