import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './utils/authStore';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DashboardUX from './pages/DashboardUX';
import ProjectPage from './pages/ProjectPage';
import OnboardingFlowFixed from './components/onboarding/OnboardingFlow';

function ProtectedRoute({ element }) {
  const { token } = useAuthStore();
  return token ? element : <Navigate to="/login" />;
}

function App() {
  const { token, getProfile, user } = useAuthStore();
  const [showOnboarding, setShowOnboarding] = React.useState(false);

  React.useEffect(() => {
    if (token) {
      getProfile();
    }
    
    // Verificar si el usuario ya completó el onboarding
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    if (!onboardingCompleted && token) {
      setShowOnboarding(true);
    }
  }, [token]);

  const handleOnboardingComplete = (preferences) => {
    setShowOnboarding(false);
    localStorage.setItem('onboardingCompleted', 'true');
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  };

  // Si el onboarding está activo, mostrarlo
  if (showOnboarding) {
    return (
      <ThemeProvider>
        <OnboardingFlowFixed onComplete={handleOnboardingComplete} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<DashboardUX />} />}
          />
          <Route
            path="/dashboard-old"
            element={<ProtectedRoute element={<Dashboard />} />}
          />
          <Route
            path="/project/:id"
            element={<ProtectedRoute element={<ProjectPage />} />}
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
