import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import RegisterConfirmationPage from './pages/RegisterConfirmationPage'
import PasswordRecoveryPage from './pages/PasswordRecoveryPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import ProductDetailPage from './pages/ProductDetailPage'
import Header from './components/Header'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'

/**
 * AppContent Component
 * Handles the main content layout with conditional header and footer display
 * Header and Footer are hidden on authentication pages and landing page (they have their own)
 */
function AppContent() {
  const location = useLocation()
  
  // Hide header and footer on authentication pages, landing page, home page, and product detail page
  const pagesWithoutHeader = ['/', '/login', '/register', '/register-confirmation', '/password-recovery', '/reset-password']
  const pagesWithoutFooter = ['/', '/home', '/login', '/register', '/register-confirmation', '/password-recovery', '/reset-password']
  const showHeader = !pagesWithoutHeader.includes(location.pathname) && !location.pathname.startsWith('/reset-password/')
  const showFooter = !pagesWithoutFooter.includes(location.pathname) && !location.pathname.startsWith('/reset-password/') && !location.pathname.startsWith('/product/')

  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <Header />}
      <main className="flex-1">
        <PageTransition key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/register-confirmation" element={<RegisterConfirmationPage />} />
            <Route path="/password-recovery" element={<PasswordRecoveryPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/product/:productName" element={<ProductDetailPage />} />
          </Routes>
        </PageTransition>
      </main>
      {showFooter && <Footer />}
    </div>
  )
}

/**
 * App Component
 * Root component that wraps the application with React Router
 */
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
