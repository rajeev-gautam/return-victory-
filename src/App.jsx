import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import SchemesPage from './pages/SchemesPage';
import DetectorPage from './pages/DetectorPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import FAQPage from './pages/FAQPage';
import HelpCenter from './pages/HelpCenter';
import ContactPage from './pages/ContactPage';
import QueryPopup from './components/QueryPopup';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Footer from './components/Footer';
import FloatingBot from './components/FloatingBot';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/schemes" element={<SchemesPage />} />
            <Route path="/detector" element={<DetectorPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
          </Routes>
          <Footer />
          <FloatingBot />
          <QueryPopup />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
