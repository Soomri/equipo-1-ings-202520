import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../config/api'

const PasswordRecoveryPage = () => {
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      setError('Por favor ingresa tu correo electrónico')
      setIsLoading(false)
      return
    }
    if (!emailRegex.test(email)) {
      setError('Por favor ingresa un correo electrónico válido')
      setIsLoading(false)
      return
    }

    try {
      // Call backend API to send recovery email
      const response = await authService.recoverPassword(email)
      console.log('Recovery email sent:', response)
      
      // Show success message
      setEmailSent(true)
    } catch (err) {
      console.error('Recovery error:', err)
      
      // User-friendly error messages
      let errorMsg = err.message || 'Ocurrió un error al enviar el correo'
      if (errorMsg.includes('no encontrado') || errorMsg.includes('404')) {
        errorMsg = 'No existe una cuenta con este correo electrónico'
      } else if (errorMsg.includes('Network Error')) {
        errorMsg = 'Error de conexión. Verifica tu conexión a internet.'
      } else if (errorMsg.includes('500')) {
        errorMsg = 'Error del servidor. Intenta más tarde.'
      }
      
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    navigate('/login')
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

      {/* Main content centered */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        gap: '40px'
      }}>
        {/* Page title */}
        <h1 style={{
          fontSize: '48px',
          fontWeight: '600',
          textAlign: 'center',
          lineHeight: '1.2',
          marginTop: '100px',
          color: '#000000'
        }}>
          Recuperar contraseña
        </h1>

        {!emailSent ? (
          // Email input form
          <div style={{
            width: '600px',
            backgroundColor: '#F5F5F5',
            border: '1px solid rgba(0, 0, 0, 0.25)',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            borderRadius: '8px',
            padding: '50px 60px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <p style={{
              fontSize: '18px',
              color: '#000000',
              textAlign: 'center',
              marginBottom: '30px',
              lineHeight: '1.6'
            }}>
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </p>

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              {/* Email input field */}
              <div style={{ marginBottom: '20px' }}>
                <label 
                  htmlFor="recovery-email-input"
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
                  id="recovery-email-input"
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    height: '65px',
                    backgroundColor: 'rgba(217, 217, 217, 0.5)',
                    border: '1px solid #000000',
                    borderRadius: '4px',
                    padding: '0 15px',
                    fontSize: '18px',
                    color: '#1a1a1a',
                    opacity: isLoading ? 0.6 : 1
                  }}
                />
              </div>

              {/* Error message */}
              {error && (
                <div style={{
                  color: '#D32F2F',
                  backgroundColor: '#FFEBEE',
                  padding: '12px 20px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  marginBottom: '20px',
                  textAlign: 'center',
                  border: '1px solid #EF5350'
                }}>
                  {error}
                </div>
              )}

              {/* Submit button */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '200px',
                    height: '50px',
                    backgroundColor: isLoading ? '#A8E88D' : '#D2EDCC',
                    border: '1px solid #000000',
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
                  {isLoading ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Success message
          <>
            {/* Message box with mail icon */}
            <div style={{
              position: 'relative',
              width: '800px',
              height: '250px',
              backgroundColor: '#D2EDCC',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              padding: '40px 60px'
            }}>
              {/* Mail icon container (positioned at top-left corner of green box) */}
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transform: 'translate(-50%, -50%)'
              }}>
                {/* Rectangle background */}
                <img 
                  src="/client_images/Rectangle-mail.svg" 
                  alt="Mail Background" 
                  style={{
                    width: 'auto',
                    height: 'auto'
                  }}
                />
                {/* Mail icon on top */}
                <img 
                  src="/client_images/Mail-icon.svg" 
                  alt="Mail Icon" 
                  style={{
                    position: 'absolute',
                    width: 'auto',
                    height: 'auto'
                  }}
                />
              </div>

              {/* Message text */}
              <div style={{
                flex: 1,
                color: '#000000',
                fontSize: '18px',
                lineHeight: '1.6'
              }}>
                <p style={{ marginBottom: '16px' }}>
                  <strong>Instrucciones enviadas a tu correo.</strong>
                </p>
                <p style={{ marginBottom: '16px' }}>
                  Hemos enviado un enlace para restablecer tu contraseña a tu email.
                </p>
                <p>
                  Revisa tu bandeja de entrada y sigue los pasos para crear una nueva contraseña.
                </p>
              </div>
            </div>

            {/* Back to login button */}
            <button
              onClick={handleBackToLogin}
              style={{
                width: '250px',
                height: '50px',
                backgroundColor: '#D2EDCC',
                border: '1px solid #000000',
                borderRadius: '20px',
                color: '#000000',
                fontSize: '18px',
                fontWeight: '500',
                cursor: 'pointer',
                padding: '10px 20px',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                marginTop: '20px'
              }}
            >
              Volver a Inicio de sesión
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default PasswordRecoveryPage

