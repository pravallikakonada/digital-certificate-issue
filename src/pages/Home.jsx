import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <style>
        {`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>

      <div style={container}>
        {/* Hero Section */}
        <div style={heroSection}>
          <div style={heroContent}>
            <h1 style={heroTitle}>
              <span style={{ color: "#667eea" }}>Digital Certificate</span> Issuance & Verification
            </h1>
            <p style={heroSubtitle}>
              A secure, modern platform for conducting online exams, issuing verifiable digital certificates, and maintaining authenticity
            </p>
            <div style={ctaButtons}>
              
              <Link to="/student-login" style={btnSecondary} onMouseEnter={(e) => e.target.style.opacity = "0.9"} onMouseLeave={(e) => e.target.style.opacity = "1"}>
                <span style={{ marginRight: "8px" }}>👨‍🎓</span>Student Login
              </Link>
              <Link to="/verify" style={btnTertiary} onMouseEnter={(e) => e.target.style.opacity = "0.9"} onMouseLeave={(e) => e.target.style.opacity = "1"}>
                <span style={{ marginRight: "8px" }}>✅</span>Verify Certificate
              </Link>
            </div>
          </div>

          {/* Decorative Shape */}
          <div style={decorativeShape}></div>
        </div>

        {/* Features Grid */}
        <div style={featuresContainer}>
          <div style={sectionHeader}>
            <h2 style={sectionTitle}>Key Features</h2>
            <p style={sectionSubtitle}>Everything you need for secure certificate management</p>
          </div>

          <div style={featuresGrid}>
            <div style={featureCard}>
              <div style={featureIcon}>🏢</div>
              <h3 style={featureCardTitle}>Admin Module</h3>
              <p style={featureCardText}>
                Send exam invitations, monitor test submissions, and issue digital certificates to successful candidates
              </p>
              <Link to="/admin-login" style={featureLink}>Manage System →</Link>
            </div>

            <div style={featureCard}>
              <div style={featureIcon}>👨‍🎓</div>
              <h3 style={featureCardTitle}>Student Module</h3>
              <p style={featureCardText}>
                Access your account, take online exams, view your earned certificates, and download them securely
              </p>
              <Link to="/student-login" style={featureLink}>Take Exam →</Link>
            </div>

            <div style={featureCard}>
              <div style={featureIcon}>🔍</div>
              <h3 style={featureCardTitle}>Verification Module</h3>
              <p style={featureCardText}>
                Verify certificate authenticity instantly using certificate IDs or QR codes for complete transparency
              </p>
              <Link to="/verify" style={featureLink}>Verify Now →</Link>
            </div>

            <div style={featureCard}>
              <div style={featureIcon}>🛡️</div>
              <h3 style={featureCardTitle}>Secure & Reliable</h3>
              <p style={featureCardText}>
                Enterprise-grade security with tamper-proof digital signatures and encrypted data storage
              </p>
            </div>

            <div style={featureCard}>
              <div style={featureIcon}>📱</div>
              <h3 style={featureCardTitle}>QR Code Integration</h3>
              <p style={featureCardText}>
                Scan QR codes on certificates for instant verification without manual ID entry
              </p>
            </div>

            <div style={featureCard}>
              <div style={featureIcon}>⚡</div>
              <h3 style={featureCardTitle}>Fast & Efficient</h3>
              <p style={featureCardText}>
                Instant exam processing, automatic certificate generation, and real-time verification results
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div style={howItWorksSection}>
          <h2 style={sectionTitle}>How It Works</h2>
          <div style={stepsContainer}>
            <div style={stepCard}>
              <div style={stepNumber}>1</div>
              <h3 style={stepTitle}>Register</h3>
              <p style={stepText}>Create your admin or student account</p>
            </div>
            <div style={stepArrow}>→</div>
            <div style={stepCard}>
              <div style={stepNumber}>2</div>
              <h3 style={stepTitle}>Exam</h3>
              <p style={stepText}>Take online exams and submit</p>
            </div>
            <div style={stepArrow}>→</div>
            <div style={stepCard}>
              <div style={stepNumber}>3</div>
              <h3 style={stepTitle}>Certificate</h3>
              <p style={stepText}>Instant certificate issuance</p>
            </div>
            <div style={stepArrow}>→</div>
            <div style={stepCard}>
              <div style={stepNumber}>4</div>
              <h3 style={stepTitle}>Verify</h3>
              <p style={stepText}>Share & verify anytime</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div style={ctaSection}>
          <h2 style={ctaTitle}>Ready to Get Started?</h2>
          <p style={ctaText}>Choose your role and begin managing digital certificates today</p>
          <div style={ctaButtonsGroup}>
            <Link to="/admin-login" style={ctaBtnPrimary}>Admin Access</Link>
            <Link to="/student-login" style={ctaBtnSecondary}>Student Portal</Link>
          </div>
        </div>
      </div>
    </>
  );
};

const container = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #f0f4ff 0%, #e8f0ff 50%, #f5f8ff 100%)",
  paddingBottom: "60px",
};

const heroSection = {
  minHeight: "600px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "60px 20px",
  position: "relative",
  overflow: "hidden",
};

const heroContent = {
  maxWidth: "800px",
  textAlign: "center",
  animation: "slideInUp 0.8s ease-out",
  position: "relative",
  zIndex: 2,
};

const heroTitle = {
  fontSize: "52px",
  fontWeight: "800",
  color: "#1f2937",
  margin: "0 0 16px 0",
  lineHeight: "1.2",
};

const heroSubtitle = {
  fontSize: "18px",
  color: "#6b7280",
  lineHeight: "1.8",
  margin: "0 0 32px 0",
  maxWidth: "700px",
  marginLeft: "auto",
  marginRight: "auto",
};

const ctaButtons = {
  display: "flex",
  gap: "16px",
  justifyContent: "center",
  flexWrap: "wrap",
};

const btnPrimary = {
  display: "inline-flex",
  alignItems: "center",
  padding: "14px 28px",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  textDecoration: "none",
  borderRadius: "10px",
  fontWeight: "600",
  fontSize: "16px",
  cursor: "pointer",
  border: "none",
  transition: "all 0.3s ease",
  boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
};

const btnSecondary = {
  display: "inline-flex",
  alignItems: "center",
  padding: "14px 28px",
  background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
  color: "white",
  textDecoration: "none",
  borderRadius: "10px",
  fontWeight: "600",
  fontSize: "16px",
  cursor: "pointer",
  border: "none",
  transition: "all 0.3s ease",
  boxShadow: "0 10px 30px rgba(30, 58, 138, 0.3)",
};

const btnTertiary = {
  display: "inline-flex",
  alignItems: "center",
  padding: "14px 28px",
  background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)",
  color: "white",
  textDecoration: "none",
  borderRadius: "10px",
  fontWeight: "600",
  fontSize: "16px",
  cursor: "pointer",
  border: "none",
  transition: "all 0.3s ease",
  boxShadow: "0 10px 30px rgba(13, 148, 136, 0.3)",
};

const decorativeShape = {
  position: "absolute",
  top: "-200px",
  right: "-200px",
  width: "600px",
  height: "600px",
  background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(20, 184, 166, 0.1))",
  borderRadius: "50%",
  zIndex: 1,
};

const featuresContainer = {
  maxWidth: "1200px",
  margin: "80px auto",
  padding: "0 20px",
};

const sectionHeader = {
  textAlign: "center",
  marginBottom: "60px",
  animation: "slideInUp 0.8s ease-out 0.1s both",
};

const sectionTitle = {
  fontSize: "44px",
  fontWeight: "800",
  color: "#1f2937",
  margin: "0 0 12px 0",
};

const sectionSubtitle = {
  fontSize: "16px",
  color: "#6b7280",
  margin: 0,
};

const featuresGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "24px",
};

const featureCard = {
  background: "white",
  borderRadius: "14px",
  padding: "32px 24px",
  textAlign: "center",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
  border: "1px solid #f3f4f6",
  transition: "all 0.3s ease",
  animation: "slideInUp 0.6s ease-out both",
  cursor: "pointer",
};

const featureIcon = {
  fontSize: "48px",
  marginBottom: "16px",
};

const featureCardTitle = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#1f2937",
  margin: "0 0 8px 0",
};

const featureCardText = {
  fontSize: "14px",
  color: "#6b7280",
  lineHeight: "1.6",
  margin: "0 0 16px 0",
};

const featureLink = {
  display: "inline-block",
  color: "#667eea",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "14px",
  transition: "all 0.3s ease",
};

const howItWorksSection = {
  maxWidth: "1200px",
  margin: "80px auto",
  padding: "0 20px",
  textAlign: "center",
};

const stepsContainer = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "20px",
  flexWrap: "wrap",
  marginTop: "60px",
};

const stepCard = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "12px",
  flex: "0 1 180px",
};

const stepNumber = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "28px",
  fontWeight: "800",
  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
};

const stepTitle = {
  fontSize: "16px",
  fontWeight: "700",
  color: "#1f2937",
  margin: 0,
};

const stepText = {
  fontSize: "13px",
  color: "#6b7280",
  margin: 0,
};

const stepArrow = {
  fontSize: "28px",
  color: "#d1d5db",
  fontWeight: "bold",
  flex: "0 0 auto",
};

const ctaSection = {
  maxWidth: "1000px",
  margin: "100px auto",
  padding: "60px 40px",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  borderRadius: "20px",
  textAlign: "center",
  boxShadow: "0 20px 50px rgba(102, 126, 234, 0.3)",
  marginLeft: "20px",
  marginRight: "20px",
};

const ctaTitle = {
  fontSize: "40px",
  fontWeight: "800",
  color: "white",
  margin: "0 0 12px 0",
};

const ctaText = {
  fontSize: "16px",
  color: "rgba(255, 255, 255, 0.9)",
  margin: "0 0 32px 0",
};

const ctaButtonsGroup = {
  display: "flex",
  gap: "16px",
  justifyContent: "center",
  flexWrap: "wrap",
};

const ctaBtnPrimary = {
  padding: "14px 28px",
  background: "white",
  color: "#667eea",
  textDecoration: "none",
  borderRadius: "10px",
  fontWeight: "600",
  fontSize: "16px",
  cursor: "pointer",
  border: "none",
  transition: "all 0.3s ease",
  display: "inline-block",
};

const ctaBtnSecondary = {
  padding: "14px 28px",
  background: "transparent",
  color: "white",
  textDecoration: "none",
  borderRadius: "10px",
  fontWeight: "600",
  fontSize: "16px",
  cursor: "pointer",
  border: "2px solid white",
  transition: "all 0.3s ease",
  display: "inline-block",
};

export default Home;
