import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../config/api'

const RegisterPage = () => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async () => {
    setErrorMessage('')
    setIsLoading(true)

    try {
      // Check if all fields are filled
      if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
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

      // Validate password requirements
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
      if (!passwordRegex.test(password)) {
        setErrorMessage('La contraseña no cumple con los requisitos mínimos')
        setIsLoading(false)
        return
      }

      // Check if passwords match
      if (password !== confirmPassword) {
        setErrorMessage('Las contraseñas no coinciden')
        setIsLoading(false)
        return
      }

      // Call API to register user
      const response = await authService.register({
        name: fullName,
        email: email,
        password: password
      })

      console.log('Registration successful:', response)
      
      // Navigate to confirmation page with success state
      navigate('/register-confirmation', { 
        state: { 
          registrationSuccess: true,
          userName: fullName
        } 
      })
    } catch (error) {
      console.error('Registration error:', error)
      
      // User-friendly error messages
      let message = error.message
      if (message.includes('correo ya ha sido registrado') || message.includes('already registered')) {
        message = 'Este correo ya está registrado. Intenta iniciar sesión.'
      } else if (message.includes('contraseña debe') || message.includes('password')) {
        message = 'La contraseña no cumple con los requisitos de seguridad.'
      } else if (message.includes('Network Error')) {
        message = 'Error de conexión. Verifica tu conexión a internet.'
      } else if (message.includes('base de datos') || message.includes('503')) {
        message = 'Servicio temporalmente no disponible. Intenta más tarde.'
      } else if (!message || message === 'Error al registrar usuario') {
        message = 'Error al registrar. Verifica tus datos e intenta nuevamente.'
      }
      
      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      {/* Logo in top left corner */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '40px'
      }}>
        <Link to="/">
          <img 
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

      {/* Centered registration form */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}>
        <div style={{
          width: '600px',
          minHeight: '230px',
          backgroundColor: '#F5F5F5',
          border: '1px solid rgba(0, 0, 0, 0.25)',
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '40px 65px'
        }}>
          {/* Page title */}
          <h1 style={{
            fontSize: '48px',
            fontWeight: '600',
            marginBottom: '35px',
            textAlign: 'center',
            lineHeight: '1.2'
          }}>
            <span style={{ color: '#000000' }}>Registrate en </span>
            <span style={{ color: '#4CA772' }}>Plaze</span>
          </h1>

          {/* User icon with background ellipse */}
          <div style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '35px'
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

          {/* Full name input field */}
          <input
            type="text"
            placeholder="Nombre completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
            style={{
              width: '470px',
              height: '65px',
              backgroundColor: 'rgba(217, 217, 217, 0.5)',
              border: '1px solid #000000',
              borderRadius: '4px',
              padding: '0 15px',
              fontSize: '18px',
              marginBottom: '35px'
            }}
          />

          {/* Email input field */}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
            style={{
              width: '470px',
              height: '65px',
              backgroundColor: 'rgba(217, 217, 217, 0.5)',
              border: '1px solid #000000',
              borderRadius: '4px',
              padding: '0 15px',
              fontSize: '18px',
              marginBottom: '35px'
            }}
          />

          {/* Password input field */}
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
            style={{
              width: '470px',
              height: '65px',
              backgroundColor: 'rgba(217, 217, 217, 0.5)',
              border: '1px solid #000000',
              borderRadius: '4px',
              padding: '0 15px',
              fontSize: '18px',
              marginBottom: '15px'
            }}
          />

          {/* Password requirements */}
          <div style={{
            width: '470px',
            fontSize: '14px',
            color: '#666666',
            marginBottom: '35px',
            lineHeight: '1.5'
          }}>
            La contraseña debe contener mínimo 8 caracteres, una mayúscula, un número y un carácter especial (!@#$%^&*).
          </div>

          {/* Confirm password input field */}
          <input
            type="password"
            placeholder="Repetir contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
            style={{
              width: '470px',
              height: '65px',
              backgroundColor: 'rgba(217, 217, 217, 0.5)',
              border: '1px solid #000000',
              borderRadius: '4px',
              padding: '0 15px',
              fontSize: '18px',
              marginBottom: '20px'
            }}
          />

          {/* Error message */}
          {errorMessage && (
            <div style={{
              color: '#D32F2F',
              backgroundColor: '#FFEBEE',
              padding: '12px 20px',
              borderRadius: '4px',
              fontSize: '14px',
              marginBottom: '20px',
              width: '470px',
              textAlign: 'center',
              border: '1px solid #EF5350'
            }}>
              {errorMessage}
            </div>
          )}

          {/* Register button */}
          <button
            onClick={handleRegister}
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
              padding: '10px',
              marginTop: '10px',
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage

