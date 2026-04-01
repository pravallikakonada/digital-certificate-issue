import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import SendExamMail from "./pages/SendExamMail";
import TakeTest from "./pages/TakeTest";
import CompletedTests from "./pages/CompletedTests";
import Dashboard from "./pages/Dashboard.jsx";
import MyCertificates from "./pages/MyCertificates.jsx";
import VerifyCertificate from "./pages/VerifyCertificate.jsx";
import IssueCertificate from "./pages/IssueCertificate.jsx";
import UploadCSV from "./pages/UploadCSV.jsx";
import NotFound from "./pages/NotFound.jsx";
import AuthExam from "./pages/AuthExam.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-certificates" element={<MyCertificates />} />
        <Route path="/verify" element={<VerifyCertificate />} />
        <Route path="/issue" element={<IssueCertificate />} />
        <Route path="/upload" element={<UploadCSV />} />
        <Route path="/send-exam-mail" element={<SendExamMail />} />
        <Route path="/auth-exam" element={<AuthExam />} />
       <Route path="/take-test" element={<TakeTest />} />
        <Route path="/completed-tests" element={<CompletedTests />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;