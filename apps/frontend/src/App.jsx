import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import { getToken } from './utils/auth';

function App() {
  // State untuk track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());

  return (
    <BrowserRouter>
      <Routes>
        {/* Route untuk halaman login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />  // Redirect ke dashboard jika sudah login
            ) : (
              <Login onLogin={() => setIsAuthenticated(true)} />
            )
          }
        />
        
        {/* Route untuk halaman register */}
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />  // Redirect ke dashboard jika sudah login
            ) : (
              <Register onRegister={() => setIsAuthenticated(true)} />
            )
          }
        />
        
        {/* Route untuk dashboard (protected) */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Dashboard onLogout={() => setIsAuthenticated(false)} />
            ) : (
              <Navigate to="/login" replace />  // Redirect ke login jika belum login
            )
          }
        />
        
        {/* Route untuk 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

