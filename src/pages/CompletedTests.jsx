import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Header from "../components/Header";

const COMPLETED_TESTS_API = "/api/exams/completed-tests/";
const UPDATE_STATUS_API = "/api/exams/update-status/";

const CompletedTests = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "passed", "failed"
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const applyFilterToTests = (testData, filterType) => {
    if (filterType === "all") {
      return testData;
    }
    return testData.filter(test => test.result === (filterType === "passed" ? "Passed" : "Failed"));
  };

  const fetchTests = async () => {
    try {
      console.log("Fetching completed tests");
      setLoading(true);
      const res = await api.get(COMPLETED_TESTS_API);
      const testData = res.data || [];
      console.log("Fetched test data:", testData);

      // Ensure each test has a result based on score if missing
      const processedData = testData.map(test => ({
        ...test,
        result: test.result || (test.score >= 3 ? "Passed" : "Failed")
      }));

      setTests(processedData);
      setFilteredTests(applyFilterToTests(processedData, filter));
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Error fetching completed tests:", error);
      alert("Failed to load completed tests");
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (filterType) => {
    setFilter(filterType);
    if (filterType === "all") {
      setFilteredTests(tests);
    } else if (filterType === "passed") {
      setFilteredTests(tests.filter(test => test.result === "Passed"));
    } else if (filterType === "failed") {
      setFilteredTests(tests.filter(test => test.result === "Failed"));
    }
  };

  const handleIssueCertificate = async (test) => {
    try {
      // Navigate to /issue page for certificate issuance
      navigate('/issue');
    } catch (error) {
      console.error("Error navigating to issue page:", error);
      alert("Failed to navigate to certificate issuance page. Please try again.");
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <Header />

      <div style={container}>
        <div style={content}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h1 style={title}>Completed Tests</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
              Last updated: {lastRefresh.toLocaleTimeString()}
            </span>
            <button
              type="button"
              style={refreshBtn}
              onClick={() => fetchTests()}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "🔄 Refresh"}
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
          <div style={filterContainer}>
            <button
              style={{
                ...filterBtn,
                backgroundColor: filter === "all" ? "#3b82f6" : "#e5e7eb",
                color: filter === "all" ? "white" : "#374151"
              }}
              onClick={() => applyFilter("all")}
            >
              All Tests ({tests.length})
            </button>
            <button
              style={{
                ...filterBtn,
                backgroundColor: filter === "passed" ? "#10b981" : "#e5e7eb",
                color: filter === "passed" ? "white" : "#374151"
              }}
              onClick={() => applyFilter("passed")}
            >
              Passed ({tests.filter(t => t.result === "Passed").length})
            </button>
            <button
              style={{
                ...filterBtn,
                backgroundColor: filter === "failed" ? "#ef4444" : "#e5e7eb",
                color: filter === "failed" ? "white" : "#374151"
              }}
              onClick={() => applyFilter("failed")}
            >
              Failed ({tests.filter(t => t.result === "Failed").length})
            </button>
          </div>

          {loading ? (
            <div style={loadingContainer}>
              <div style={spinner}></div>
              <p>Loading completed tests...</p>
            </div>
          ) : filteredTests.length === 0 ? (
            <div style={emptyState}>
              <h3>No {filter !== "all" ? filter : ""} tests found</h3>
              <p>{filter === "all" ? "Students haven't completed any exams yet." : `No ${filter} test results to show.`}</p>
              {filter !== "all" && (
                <button
                  style={showAllBtn}
                  onClick={() => applyFilter("all")}
                >
                  Show All Tests
                </button>
              )}
            </div>
          ) : (
            <div style={cardsGrid}>
              {filteredTests.map((test) => (
                <div key={test.id} style={card}>
                  <div style={cardHeader}>
                    <h3 style={studentName}>{test.student_name}</h3>
                    <div style={resultIndicator}>
                      <span style={{
                        ...resultBadge,
                        backgroundColor: test.result === "Passed" ? "#10b981" : "#ef4444",
                        color: "white"
                      }}>
                        {test.result === "Passed" ? "✓ PASSED" : "✗ FAILED"}
                      </span>
                    </div>
                  </div>

                  <div style={cardBody}>
                    <div style={infoRow}>
                      <span style={label}>Email:</span>
                      <span style={value}>{test.student_email}</span>
                    </div>

                    <div style={infoRow}>
                      <span style={label}>Course:</span>
                      <span style={value}>{test.course_title}</span>
                    </div>

                    <div style={infoRow}>
                      <span style={label}>Score:</span>
                      <span style={scoreValue}>
                        {test.score}/{test.total_questions}
                      </span>
                    </div>

                    <div style={infoRow}>
                      <span style={label}>Started At:</span>
                      <span style={value}>
                        {test.started_at ? new Date(test.started_at).toLocaleString() : 'N/A'}
                      </span>
                    </div>

                    <div style={infoRow}>
                      <span style={label}>Submitted At:</span>
                      <span style={value}>
                        {new Date(test.submitted_at).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div style={cardFooter}>
                    {test.result === "Passed" && test.status !== "Certificate Issued" && (
                      <button
                        style={issueBtn}
                        onClick={() => handleIssueCertificate(test)}
                      >
                        Issue Certificate
                      </button>
                    )}

                    {test.status === "Certificate Issued" && (
                      <div style={issuedBadge}>
                        ✅ Certificate Issued
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const container = {
  minHeight: "100vh",
  background: "#f8fafc",
  padding: "20px",
};

const content = {
  maxWidth: "1200px",
  margin: "0 auto",
};

const title = {
  textAlign: "center",
  color: "#1e293b",
  marginBottom: "20px",
  fontSize: "2.5rem",
  fontWeight: "700",
};

const filterContainer = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  marginBottom: "30px",
  flexWrap: "wrap",
};

const filterBtn = {
  padding: "10px 20px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "0.9rem",
  transition: "all 0.2s",
  minWidth: "120px",
};

const refreshBtn = {
  padding: "10px 20px",
  background: "#f3f4f6",
  color: "#374151",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "0.9rem",
  transition: "all 0.2s",
};

const loadingContainer = {
  textAlign: "center",
  padding: "60px 20px",
};

const spinner = {
  width: "40px",
  height: "40px",
  border: "4px solid #e2e8f0",
  borderTop: "4px solid #3b82f6",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  margin: "0 auto 20px",
};

const emptyState = {
  textAlign: "center",
  padding: "60px 20px",
  background: "white",
  borderRadius: "12px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
};

const cardsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
  gap: "20px",
};

const card = {
  background: "white",
  borderRadius: "12px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  overflow: "hidden",
  transition: "transform 0.2s, box-shadow 0.2s",
  ":hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
};

const cardHeader = {
  padding: "20px 20px 0 20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const studentName = {
  margin: 0,
  fontSize: "1.25rem",
  fontWeight: "600",
  color: "#1e293b",
};

const resultIndicator = {
  display: "flex",
  alignItems: "center",
};

const resultBadge = {
  padding: "8px 16px",
  borderRadius: "20px",
  fontSize: "0.875rem",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

const cardBody = {
  padding: "16px 20px",
};

const infoRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "8px",
};

const label = {
  fontWeight: "500",
  color: "#64748b",
  fontSize: "0.875rem",
};

const value = {
  fontWeight: "500",
  color: "#1e293b",
  fontSize: "0.875rem",
};

const scoreValue = {
  fontWeight: "600",
  color: "#1e293b",
  fontSize: "0.875rem",
};

const cardFooter = {
  padding: "0 20px 20px 20px",
};

const issueBtn = {
  width: "100%",
  padding: "8px 12px",
  background: "#f3f4f6",
  color: "#374151",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "13px",
  transition: "all 0.2s",
};

const issuedBadge = {
  background: "#dcfce7",
  color: "#166534",
  padding: "8px 12px",
  borderRadius: "6px",
  fontSize: "0.875rem",
  fontWeight: "600",
  border: "1px solid #bbf7d0",
  textAlign: "center",
};

const showAllBtn = {
  marginTop: "15px",
  padding: "10px 20px",
  background: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "0.9rem",
};

export default CompletedTests;