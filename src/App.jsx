import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import StudentLogin from "./pages/StudentLogin";
import StudentSignup from "./pages/StudentSignup";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import SendExamMail from "./pages/SendExamMail";
import AuthExam from "./pages/AuthExam";
import TakeTest from "./pages/TakeTest";
import CompletedTests from "./pages/CompletedTests";
import UploadCSV from "./pages/UploadCSV";
import IssueCertificate from "./pages/IssueCertificate";
import MyCertificates from "./pages/MyCertificates";
import VerifyCertificate from "./pages/VerifyCertificate";
import ManageCourses from "./pages/ManageCourses";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-signup" element={<StudentSignup />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />

        <Route path="/send-exam-mail" element={<SendExamMail />} />
        <Route path="/auth-exam" element={<AuthExam />} />
        <Route path="/take-test" element={<TakeTest />} />
        <Route path="/completed-tests" element={<CompletedTests />} />
        <Route path="/upload-csv" element={<UploadCSV />} />
        <Route path="/issue" element={<IssueCertificate />} />
        <Route path="/my-certificates" element={<MyCertificates />} />
        <Route path="/verify" element={<VerifyCertificate />} />
        <Route
  path="/manage-courses"
  element={
    <ProtectedRoute role="admin">
      <ManageCourses />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin-dashboard"
  element={
    <ProtectedRoute role="admin">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/send-exam-mail"
  element={
    <ProtectedRoute role="admin">
      <SendExamMail />
    </ProtectedRoute>
  }
/>

<Route
  path="/issue"
  element={
    <ProtectedRoute role="admin">
      <IssueCertificate />
    </ProtectedRoute>
  }
/>

<Route
  path="/student-dashboard"
  element={
    <ProtectedRoute role="student">
      <StudentDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/my-certificates"
  element={
    <ProtectedRoute role="student">
      <MyCertificates />
    </ProtectedRoute>
  }
/>
      </Routes>
    </Router>
  );
};

export default App;