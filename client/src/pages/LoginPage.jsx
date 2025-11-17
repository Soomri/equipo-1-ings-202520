import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../config/api'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    setErrorMessage('')
    setIsLoading(true)

    try {
      // Validate fields
      if (!email.trim() || !password.trim()) {
        setErrorMessage('Por favor completa todos los campos')
        setIsLoading(false)
        return
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setErrorMessage('Por favor ingresa un correo electrónico válido')
        setIsLoading(false)
        return
      }

      // Call API to login
      const response = await authService.login(email, password)
      
      console.log('Login successful:', response)
      
      // Redirect to home page
      navigate('/home')
    } catch (error) {
      console.error('Login error:', error)
      
      // User-friendly error messages
      let message = error.message
      if (message.includes('Correo o contraseña incorrectos')) {
        message = 'Correo o contraseña incorrectos'
      } else if (message.includes('bloqueada')) {
        message = 'Tu cuenta ha sido bloqueada temporalmente. Revisa tu correo electrónico.'
      } else if (message.includes('Network Error')) {
        message = 'Error de conexión. Verifica tu conexión a internet.'
      } else if (!message || message === 'Error al iniciar sesión') {
        message = 'Error al iniciar sesión. Intenta nuevamente.'
      }
      
      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .login-container {
            padding: 40px 30px 30px 30px !important;
          }
          .login-title {
            font-size: 36px !important;
            margin-bottom: 35px !important;
          }
          .login-input-wrapper {
            width: 100% !important;
            max-width: 350px !important;
          }
          .login-error-message {
            width: 100% !important;
            max-width: 350px !important;
          }
          .logo-container {
            left: 20px !important;
          }
          .logo-image {
            height: 150px !important;
          }
        }
        @media (max-width: 480px) {
          .login-container {
            padding: 30px 20px 20px 20px !important;
          }
          .login-title {
            font-size: 28px !important;
            margin-bottom: 25px !important;
          }
          .login-button {
            width: 160px !important;
            height: 45px !important;
            font-size: 20px !important;
          }
          .login-input-wrapper {
            width: 95% !important;
          }
          .login-error-message {
            width: 95% !important;
          }
          .logo-image {
            height: 120px !important;
          }
        }
      `}</style>
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* Logo in top left corner */}
        <div className="logo-container" style={{
          position: 'absolute',
          top: '10px',
          left: '40px'
        }}>
          <Link to="/">
            <img 
              className="logo-image"
              src="/client_images/Plaze-Logo.png" 
              alt="Plaze Logo" 
              style={{
                height: '220px',
                width: 'auto',
                objectFit: 'contain',
                cursor: 'pointer'
              }}
            />
          </Link>
        </div>

      {/* Centered login form */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}>
        <div className="login-container" style={{
          width: '100%',
          maxWidth: '680px',
          minHeight: '750px',
          backgroundColor: '#F5F5F5',
          border: '1px solid rgba(0, 0, 0, 0.25)',
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '60px 80px 40px 80px'
        }}>
          {/* Page title */}
          <h1 className="login-title" style={{
            fontSize: '48px',
            fontWeight: '600',
            marginBottom: '55px',
            textAlign: 'center',
            lineHeight: '1.2'
          }}>
            <span style={{ color: '#000000' }}>Inicia sesión en </span>
            <span style={{ color: '#4CA772' }}>Plaze</span>
          </h1>

          {/* User icon with background ellipse */}
          <div style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '40px'
          }}>
            {/* Background ellipse */}
            <img 
              src="/client_images/Ellipse-user-auth.svg" 
              alt="User Background" 
              style={{
                width: 'auto',
                height: 'auto'
              }}
            />
            {/* User icon on top */}
            <img 
              src="/client_images/User-icon.svg" 
              alt="User Icon" 
              style={{
                position: 'absolute',
                width: 'auto',
                height: 'auto'
              }}
            />
          </div>

          {/* Email input field */}
          <div className="login-input-wrapper" style={{ width: '350px', marginBottom: '32px' }}>
            <label 
              htmlFor="email-input"
              style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '500',
                marginBottom: '8px',
                color: '#333'
              }}
            >
              Correo electrónico
            </label>
            <input
              id="email-input"
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{
                width: '100%',
                height: '60px',
                backgroundColor: 'rgba(217, 217, 217, 0.5)',
                border: '1px solid #000000',
                borderRadius: '4px',
                padding: '0 12px',
                fontSize: '18px',
                color: '#1a1a1a'
              }}
            />
          </div>

          {/* Password input field */}
          <div className="login-input-wrapper" style={{ width: '350px', marginBottom: '20px' }}>
            <label 
              htmlFor="password-input"
              style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '500',
                marginBottom: '8px',
                color: '#333'
              }}
            >
              Contraseña
            </label>
            <input
              id="password-input"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{
                width: '100%',
                height: '60px',
                backgroundColor: 'rgba(217, 217, 217, 0.5)',
                border: '1px solid #000000',
                borderRadius: '4px',
                padding: '0 12px',
                fontSize: '18px',
                color: '#1a1a1a'
              }}
            />
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="login-error-message" style={{
              color: '#D32F2F',
              backgroundColor: '#FFEBEE',
              padding: '12px 20px',
              borderRadius: '4px',
              fontSize: '14px',
              marginBottom: '20px',
              width: '350px',
              textAlign: 'center',
              border: '1px solid #EF5350'
            }}>
              {errorMessage}
            </div>
          )}

          {/* Login button */}
          <button
            className="login-button"
            onClick={handleLogin}
            disabled={isLoading}
            style={{
              width: '200px',
              height: '50px',
              backgroundColor: isLoading ? '#A8E88D' : '#D2EDCC',
              border: 'none',
              borderRadius: '20px',
              color: '#000000',
              fontSize: '24px',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: '10px',
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>

          {/* Register link */}
          <div style={{
            marginTop: '20px',
            fontSize: '16px',
            textAlign: 'center'
          }}>
            <span style={{ color: '#000000' }}>¿Aún no tienes una cuenta? </span>
            <Link 
              to="/register" 
              style={{
                color: '#4CA772',
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
            >
              Regístrate ahora
            </Link>
          </div>

          {/* Forgot password link */}
          <div style={{
            marginTop: '15px',
            fontSize: '16px',
            textAlign: 'center'
          }}>
            <span style={{ color: '#000000' }}>¿Olvidaste tu contraseña? </span>
            <Link 
              to="/password-recovery" 
              style={{
                color: '#4CA772',
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
            >
              Recuperar contraseña
            </Link>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

export default LoginPage

