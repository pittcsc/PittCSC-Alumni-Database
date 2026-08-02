import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import AlumniListPage from './pages/AlumniListPage';
import AlumniDetailPage from './pages/AlumniDetailPage';
import ConnectionsPage from './pages/ConnectionsPage';
import AdminPage from './pages/AdminPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import CompanyProcessesPage from './pages/CompanyProcessesPage';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

function App() {
  const { checkAuth } = useAuthStore();
  
  useEffect(() => {
    // Check for existing session on app load
    checkAuth();
  }, [checkAuth]);
  
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile-setup" element={<ProfileSetupPage />} />
            <Route path="/alumni" element={<AlumniListPage />} />
            <Route path="/alumni/:id" element={<AlumniDetailPage />} />
            <Route path="/connections" element={<ConnectionsPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/company-processes" element={<CompanyProcessesPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;