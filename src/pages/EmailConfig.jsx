import React, { useState } from "react";
import api from "../services/api";
import Header from "../components/Header";

const EmailConfig = () => {
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleTestEmail = async () => {
    try {
      setLoading(true);
      setTestResult(null);
      
      const response = await api.get("/api/exams/test-email/");
      setTestResult({
        success: true,
        data: response.data
      });
    } catch (error) {
      setTestResult({
        success: false,
        data: error?.response?.data || { error: error?.message || "Unknown error" }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div style={container}>
        <div style={content}>
          <div style={card}>
            <h1 style={title}>📧 Email Configuration Tester</h1>
            <p style={subtitle}>
              Test your email configuration to ensure exam invitations can be sent
            </p>

            <button 
              onClick={handleTestEmail}
              disabled={loading}
              style={{
                ...testButton,
                backgroundColor: loading ? "#9ca3af" : "#3b82f6",
              }}
            >
              {loading ? "Testing..." : "🧪 Test Email Configuration"}
            </button>

            {testResult && (
              <div style={{
                ...resultBox,
                borderLeft: `4px solid ${testResult.success ? "#10b981" : "#ef4444"}`,
                backgroundColor: testResult.success ? "#ecfdf5" : "#fef2f2",
              }}>
                <h3 style={{
                  color: testResult.success ? "#059669" : "#dc2626",
                  marginTop: 0
                }}>
                  {testResult.success ? "✅ Configuration OK" : "❌ Configuration Failed"}
                </h3>

                <div style={detailsBox}>
                  {Object.entries(testResult.data).map(([key, value]) => {
                    if (key === "user_configured") {
                      value = value ? "Yes" : "No";
                    }
                    return (
                      <div key={key} style={detailRow}>
                        <span style={detailKey}>{key.replace(/_/g, " ")}:</span>
                        <span style={{
                          ...detailValue,
                          color: key === "error" ? "#dc2626" : "#374151",
                          fontWeight: key === "connection_status" ? "600" : "400",
                        }}>
                          {String(value)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {!testResult.success && (
                  <div style={solutionBox}>
                    <h4 style={solutionTitle}>🔧 Troubleshooting</h4>
                    <ul style={solutionList}>
                      <li>Check your .env file in the backend folder</li>
                      <li>If using Gmail: Enable 2-factor authentication</li>
                      <li>Generate an App Password at: https://myaccount.google.com/apppasswords</li>
                      <li>Use the App Password (not your regular password) in .env</li>
                      <li>Check internet connection and firewall (port 587)</li>
                      <li>Restart Django server after updating .env</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={card}>
            <button 
              onClick={() => setShowInstructions(!showInstructions)}
              style={instructionToggle}
            >
              {showInstructions ? "▼ Hide" : "▶ Show"} Setup Instructions
            </button>

            {showInstructions && (
              <div style={instructionContent}>
                <h3 style={sectionTitle}>📝 Gmail Setup Guide</h3>
                
                <div style={step}>
                  <span style={stepNumber}>1</span>
                  <div>
                    <p style={stepTitle}>Enable 2-Factor Authentication</p>
                    <p style={stepText}>Go to https://myaccount.google.com/security</p>
                  </div>
                </div>

                <div style={step}>
                  <span style={stepNumber}>2</span>
                  <div>
                    <p style={stepTitle}>Generate App Password</p>
                    <p style={stepText}>Go to https://myaccount.google.com/apppasswords</p>
                    <p style={stepText}>Select "Mail" and "Windows Computer"</p>
                    <p style={stepText}>Copy the 16-character password</p>
                  </div>
                </div>

                <div style={step}>
                  <span style={stepNumber}>3</span>
                  <div>
                    <p style={stepTitle}>Update .env file</p>
                    <p style={stepText}>Open backend/.env and update:</p>
                    <code style={codeBlock}>
{`EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-16-char-app-password`}
                    </code>
                  </div>
                </div>

                <div style={step}>
                  <span style={stepNumber}>4</span>
                  <div>
                    <p style={stepTitle}>Restart Backend</p>
                    <p style={stepText}>Stop and restart your Django development server</p>
                  </div>
                </div>

                <div style={step}>
                  <span style={stepNumber}>5</span>
                  <div>
                    <p style={stepTitle}>Test Again</p>
                    <p style={stepText}>Click the test button above to verify</p>
                  </div>
                </div>

                <div style={noteBox}>
                  <strong>ℹ️ Note:</strong> Never commit your real email credentials to git. Use environment variables in production.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const container = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #eef4ff, #dbeafe)",
  padding: "40px 20px",
  fontFamily: "Arial, sans-serif",
};

const content = {
  maxWidth: "800px",
  margin: "0 auto",
};

const card = {
  background: "#ffffff",
  borderRadius: "12px",
  padding: "32px",
  marginBottom: "24px",
  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
};

const title = {
  margin: "0 0 10px 0",
  fontSize: "32px",
  color: "#1e3a8a",
  fontWeight: "700",
};

const subtitle = {
  margin: "0 0 24px 0",
  fontSize: "16px",
  color: "#64748b",
};

const testButton = {
  width: "100%",
  padding: "14px 24px",
  fontSize: "16px",
  fontWeight: "600",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "background-color 0.3s",
};

const resultBox = {
  marginTop: "24px",
  padding: "20px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
};

const detailsBox = {
  display: "grid",
  gap: "12px",
};

const detailRow = {
  display: "grid",
  gridTemplateColumns: "200px 1fr",
  gap: "16px",
};

const detailKey = {
  fontWeight: "600",
  color: "#1e3a8a",
  textTransform: "capitalize",
};

const detailValue = {
  wordBreak: "break-word",
};

const solutionBox = {
  marginTop: "20px",
  padding: "16px",
  backgroundColor: "#fef3c7",
  borderRadius: "6px",
  border: "1px solid #fcd34d",
};

const solutionTitle = {
  margin: "0 0 12px 0",
  fontSize: "15px",
  fontWeight: "600",
  color: "#92400e",
};

const solutionList = {
  margin: "0",
  paddingLeft: "20px",
  color: "#92400e",
};

const instructionToggle = {
  width: "100%",
  padding: "14px 16px",
  fontSize: "16px",
  fontWeight: "600",
  backgroundColor: "#f3f4f6",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  cursor: "pointer",
  color: "#1e3a8a",
  transition: "background-color 0.3s",
};

const instructionContent = {
  marginTop: "20px",
  paddingTop: "20px",
  borderTop: "1px solid #e5e7eb",
};

const sectionTitle = {
  margin: "0 0 20px 0",
  fontSize: "18px",
  color: "#1e3a8a",
  fontWeight: "700",
};

const step = {
  display: "flex",
  gap: "16px",
  marginBottom: "24px",
};

const stepNumber = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  backgroundColor: "#3b82f6",
  color: "#ffffff",
  fontWeight: "700",
  flexShrink: 0,
};

const stepTitle = {
  margin: "0 0 4px 0",
  fontWeight: "600",
  color: "#1e3a8a",
};

const stepText = {
  margin: "4px 0",
  fontSize: "14px",
  color: "#475569",
};

const codeBlock = {
  display: "block",
  backgroundColor: "#f1f5f9",
  padding: "12px",
  borderRadius: "6px",
  fontSize: "12px",
  fontFamily: "monospace",
  color: "#1f2937",
  overflow: "auto",
  marginTop: "8px",
};

const noteBox = {
  marginTop: "20px",
  padding: "16px",
  backgroundColor: "#dbeafe",
  borderRadius: "6px",
  border: "1px solid #93c5fd",
  color: "#1e3a8a",
  fontSize: "14px",
};

export default EmailConfig;
