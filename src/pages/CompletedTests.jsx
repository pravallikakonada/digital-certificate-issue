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
      // Store test data in localStorage for auto-fill on issue page
      const testData = {
        id: test.id,
        student_name: test.student_name,
        student_email: test.student_email,
        course_title: test.course_title,
        score: test.score,
        total_questions: test.total_questions,
        result: test.result,
      };
      localStorage.setItem('certificateTestData', JSON.stringify(testData));
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
          @keyframes floatUp {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .completed-test-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 30px 90px rgba(15, 23, 42, 0.32);
          }
          .filter-button:hover,
          .refresh-button:hover,
          .issue-button:hover,
          .show-all-button:hover {
            filter: brightness(1.06);
          }
          .refresh-button:hover,
          .issue-button:hover {
            transform: translateY(-1px);
          }
        `}
      </style>
      <Header />

      <div style={container}>
        <div style={content}>
          <div style={heroCard}>
            <div>
              <p style={heroTag}>Completed Tests</p>
              <h1 style={heroTitle}>Review exam performance with confidence</h1>
              <p style={heroText}>
                Filter results, refresh instantly, and issue certificates directly from the dashboard.
              </p>
            </div>
            <div style={heroStats}>
              <div style={statCard}>
                <span style={statLabel}>Total Tests</span>
                <span style={statValue}>{tests.length}</span>
              </div>
              <div style={statCard}>
                <span style={statLabel}>Passed</span>
                <span style={statValue}>{tests.filter(t => t.result === "Passed").length}</span>
              </div>
              <div style={statCard}>
                <span style={statLabel}>Failed</span>
                <span style={statValue}>{tests.filter(t => t.result === "Failed").length}</span>
              </div>
            </div>
          </div>

          <div style={toolbar}>
            <div style={toolbarLeft}>
              <button
                className="filter-button"
                style={{
                  ...filterBtn,
                  backgroundColor: filter === "all" ? "#4338ca" : "rgba(255,255,255,0.16)",
                  color: filter === "all" ? "white" : "#f8fafc",
                  borderColor: filter === "all" ? "transparent" : "rgba(255,255,255,0.22)"
                }}
                onClick={() => applyFilter("all")}
              >
                All Tests ({tests.length})
              </button>
              <button
                className="filter-button"
                style={{
                  ...filterBtn,
                  backgroundColor: filter === "passed" ? "#10b981" : "rgba(255,255,255,0.16)",
                  color: filter === "passed" ? "white" : "#f8fafc",
                  borderColor: filter === "passed" ? "transparent" : "rgba(255,255,255,0.22)"
                }}
                onClick={() => applyFilter("passed")}
              >
                Passed ({tests.filter(t => t.result === "Passed").length})
              </button>
              <button
                className="filter-button"
                style={{
                  ...filterBtn,
                  backgroundColor: filter === "failed" ? "#ef4444" : "rgba(255,255,255,0.16)",
                  color: filter === "failed" ? "white" : "#f8fafc",
                  borderColor: filter === "failed" ? "transparent" : "rgba(255,255,255,0.22)"
                }}
                onClick={() => applyFilter("failed")}
              >
                Failed ({tests.filter(t => t.result === "Failed").length})
              </button>
            </div>
            <div style={toolbarRight}>
              <span style={updatedText}>Updated at {lastRefresh.toLocaleTimeString()}</span>
              <button
                type="button"
                className="refresh-button"
                style={refreshBtn}
                onClick={() => fetchTests()}
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          {loading ? (
            <div style={loadingContainer}>
              <div style={spinner}></div>
              <p style={loadingText}>Loading completed tests...</p>
            </div>
          ) : filteredTests.length === 0 ? (
            <div style={emptyState}>
              <h3 style={emptyTitle}>No results found</h3>
              <p style={emptyText}>
                {filter === "all"
                  ? "Students haven't completed any exams yet."
                  : `No ${filter} tests are available to display.`}
              </p>
              {filter !== "all" && (
                <button className="show-all-button" style={showAllBtn} onClick={() => applyFilter("all")}>Show All Tests</button>
              )}
            </div>
          ) : (
            <div style={cardsGrid}>
              {filteredTests.map((test) => (
                <div key={test.id} style={card} className="completed-test-card">
                  <div style={cardHeader}>
                    <div>
                      <h3 style={studentName}>{test.student_name}</h3>
                      <p style={courseTitle}>{test.course_title}</p>
                    </div>
                    <span style={{
                      ...resultBadge,
                      backgroundColor: test.result === "Passed" ? "#10b981" : "#ef4444",
                    }}>
                      {test.result === "Passed" ? "Passed" : "Failed"}
                    </span>
                  </div>

                  <div style={cardBody}>
                    <div style={infoRow}>
                      <span style={label}>Email</span>
                      <span style={value}>{test.student_email}</span>
                    </div>
                    <div style={divider} />
                    <div style={infoRow}>
                      <span style={label}>Score</span>
                      <span style={scoreValue}>{test.score}/{test.total_questions}</span>
                    </div>
                    <div style={infoRow}>
                      <span style={label}>Started</span>
                      <span style={value}>{test.started_at ? new Date(test.started_at).toLocaleString() : 'N/A'}</span>
                    </div>
                    <div style={infoRow}>
                      <span style={label}>Submitted</span>
                      <span style={value}>{new Date(test.submitted_at).toLocaleString()}</span>
                    </div>
                  </div>

                  <div style={cardFooter}>
                    {test.result === "Passed" && test.eligible_for_certificate && test.status !== "Certificate Issued" ? (
                      <button className="issue-button" style={issueBtn} onClick={() => handleIssueCertificate(test)}>
                        Issue Certificate
                      </button>
                    ) : test.status === "Certificate Issued" ? (
                      <div style={issuedBadge}>Certificate Issued</div>
                    ) : (
                      <div style={statusNote}>{test.status || "No certificate needed"}</div>
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
  background: "linear-gradient(180deg, #020617 0%, #1e293b 45%, #4338ca 100%)",
  padding: "26px 18px 42px",
  color: "white",
};

const content = {
  maxWidth: "1200px",
  margin: "0 auto",
  display: "grid",
  gap: "28px",
};

const heroCard = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "24px",
  padding: "32px",
  borderRadius: "28px",
  background: "rgba(15, 23, 42, 0.9)",
  border: "1px solid rgba(99, 102, 241, 0.16)",
  boxShadow: "0 32px 90px rgba(15, 23, 42, 0.4)",
  backdropFilter: "blur(20px)",
};

const heroTag = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.3em",
  fontSize: "0.8rem",
  color: "#c7d2fe",
};

const heroTitle = {
  margin: "10px 0 0",
  fontSize: "2.8rem",
  lineHeight: "1.05",
  fontWeight: "800",
  color: "white",
};

const heroText = {
  margin: "16px 0 0",
  maxWidth: "760px",
  lineHeight: "1.75",
  color: "rgba(255,255,255,0.82)",
  fontSize: "1rem",
};

const heroStats = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "16px",
};

const statCard = {
  background: "rgba(99, 102, 241, 0.12)",
  border: "1px solid rgba(99, 102, 241, 0.24)",
  padding: "18px 20px",
  borderRadius: "20px",
  textAlign: "center",
  backdropFilter: "blur(12px)",
};

const statLabel = {
  display: "block",
  fontSize: "0.85rem",
  color: "rgba(255,255,255,0.75)",
  marginBottom: "8px",
  fontWeight: "600",
};

const statValue = {
  fontSize: "1.85rem",
  fontWeight: "800",
  color: "white",
};

const toolbar = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  flexWrap: "wrap",
  alignItems: "center",
};

const toolbarLeft = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const toolbarRight = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
};

const updatedText = {
  color: "rgba(255,255,255,0.7)",
  fontSize: "0.95rem",
};

const filterBtn = {
  padding: "12px 20px",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "16px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "0.95rem",
  transition: "all 0.25s ease",
  minWidth: "140px",
  background: "transparent",
  color: "white",
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
};

const refreshBtn = {
  padding: "12px 20px",
  background: "rgba(99, 102, 241, 0.16)",
  color: "white",
  border: "1px solid rgba(99, 102, 241, 0.28)",
  borderRadius: "16px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "0.95rem",
  transition: "all 0.25s ease",
  boxShadow: "0 10px 22px rgba(99, 102, 241, 0.16)",
};

const loadingContainer = {
  textAlign: "center",
  padding: "80px 20px",
  background: "rgba(15, 23, 42, 0.95)",
  borderRadius: "24px",
  border: "1px solid rgba(99, 102, 241, 0.16)",
  boxShadow: "0 28px 70px rgba(15, 23, 42, 0.25)",
};

const loadingText = {
  color: "rgba(255,255,255,0.85)",
  fontSize: "1rem",
  marginTop: "18px",
};

const spinner = {
  width: "42px",
  height: "42px",
  border: "5px solid rgba(255,255,255,0.16)",
  borderTop: "5px solid #818cf8",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  margin: "0 auto",
};

const emptyState = {
  textAlign: "center",
  padding: "60px 30px",
  background: "rgba(15, 23, 42, 0.95)",
  borderRadius: "24px",
  border: "1px solid rgba(99, 102, 241, 0.2)",
  boxShadow: "0 24px 60px rgba(15, 23, 42, 0.22)",
};

const emptyTitle = {
  margin: "0 0 12px",
  fontSize: "1.6rem",
  color: "white",
};

const emptyText = {
  margin: 0,
  color: "rgba(255,255,255,0.78)",
  lineHeight: "1.7",
};

const cardsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
  gap: "22px",
};

const card = {
  background: "linear-gradient(180deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.95))",
  borderRadius: "26px",
  boxShadow: "0 24px 65px rgba(15, 23, 42, 0.28)",
  overflow: "hidden",
  border: "1px solid rgba(99, 102, 241, 0.18)",
  transition: "transform 0.28s ease, box-shadow 0.28s ease",
};

const cardHeader = {
  padding: "24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "20px",
  background: "rgba(255, 255, 255, 0.04)",
};

const studentName = {
  margin: 0,
  fontSize: "1.2rem",
  fontWeight: "800",
  color: "white",
};

const courseTitle = {
  margin: "8px 0 0",
  color: "rgba(255,255,255,0.72)",
  fontSize: "0.95rem",
};

const resultBadge = {
  padding: "10px 16px",
  borderRadius: "999px",
  fontSize: "0.85rem",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "0.4px",
  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.18)",
};

const cardBody = {
  padding: "0 24px 24px 24px",
};

const infoRow = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: "12px",
  alignItems: "center",
  marginBottom: "16px",
};

const divider = {
  gridColumn: "1 / -1",
  height: "1px",
  background: "rgba(255,255,255,0.1)",
  margin: "0 0 16px",
};

const label = {
  fontWeight: "600",
  color: "rgba(255,255,255,0.7)",
  fontSize: "0.9rem",
};

const value = {
  fontWeight: "700",
  color: "white",
  fontSize: "0.95rem",
  textAlign: "right",
};

const scoreValue = {
  fontWeight: "800",
  color: "white",
  fontSize: "1rem",
};

const cardFooter = {
  padding: "0 24px 24px 24px",
};

const issueBtn = {
  width: "100%",
  padding: "14px 18px",
  background: "linear-gradient(135deg, #4f46e5, #6366f1)",
  color: "white",
  border: "none",
  borderRadius: "16px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "0.95rem",
  transition: "transform 0.25s ease, box-shadow 0.25s ease",
  boxShadow: "0 16px 32px rgba(99, 102, 241, 0.22)",
};

const issuedBadge = {
  display: "inline-flex",
  justifyContent: "center",
  width: "100%",
  padding: "12px 0",
  background: "rgba(16, 185, 129, 0.18)",
  color: "#bbf7d0",
  borderRadius: "16px",
  fontWeight: "700",
  letterSpacing: "0.2px",
};

const statusNote = {
  padding: "14px 16px",
  background: "rgba(255,255,255,0.06)",
  borderRadius: "16px",
  color: "rgba(255,255,255,0.88)",
  textAlign: "center",
  fontWeight: "600",
  border: "1px solid rgba(255,255,255,0.08)",
};

const showAllBtn = {
  marginTop: "20px",
  padding: "12px 22px",
  background: "#6366f1",
  color: "white",
  border: "none",
  borderRadius: "18px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "0.95rem",
  boxShadow: "0 16px 40px rgba(99, 102, 241, 0.18)",
};

export default CompletedTests;