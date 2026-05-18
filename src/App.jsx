import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import GoalsPage from './pages/GoalsPage'
import InvestmentsPage from './pages/InvestmentsPage'
import ProfilePage from './pages/ProfilePage'
import PlanningDashboard from './pages/PlanningDashboard'
import SurvivalMode from './pages/SurvivalMode'
import EmotionalMap from './pages/EmotionalMap'
import InsightsPage from './pages/InsightsPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('finet-theme') || 'dark')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('finet-theme', theme)
  }, [theme])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage theme={theme} toggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <TransactionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/goals"
          element={
            <ProtectedRoute>
              <GoalsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/investments"
          element={
            <ProtectedRoute>
              <InvestmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/planning"
          element={
            <ProtectedRoute>
              <PlanningDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/insights"
          element={
            <ProtectedRoute>
              <InsightsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/emotional"
          element={
            <ProtectedRoute>
              <EmotionalMap />
            </ProtectedRoute>
          }
        />
        <Route
          path="/survival"
          element={
            <ProtectedRoute>
              <SurvivalMode />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage theme={theme} toggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
