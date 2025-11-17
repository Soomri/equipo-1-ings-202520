import React, { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const RegisterConfirmationPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { registrationSuccess, userName } = location.state || {}

  // Redirect if user didn't come from a successful registration
  useEffect(() => {
    if (!registrationSuccess) {
      navigate('/register')
    }
  }, [registrationSuccess, navigate])

  const handleBackToLogin = () => {
    navigate('/login')
  }

  // Don't render if no valid state
  if (!registrationSuccess) {
    return null
  }

  return (
    <>
      <style>{`
        @media (max-width: 850px) {
          .confirmation-title {
            font-size: 36px !important;
            margin-bottom: 60px !important;
          }
          .confirmation-box {
            width: 90% !important;
            max-width: 800px !important;
            padding: 40px 30px !important;
          }
          .logo-container {
            left: 20px !important;
          }
          .logo-image {
            height: 150px !important;
          }
        }
        @media (max-width: 480px) {
          .confirmation-title {
            font-size: 28px !important;
            margin-bottom: 40px !important;
          }
          .confirmation-box {
            width: 95% !important;
            padding: 30px 20px !important;
            height: auto !important;
            min-height: 200px !important;
          }
          .confirmation-text {
            font-size: 16px !important;
          }
          .confirmation-button {
            width: 200px !important;
            font-size: 16px !important;
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

      {/* Main content centered */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}>
        {/* Page title */}
        <h1 className="confirmation-title" style={{
          fontSize: '48px',
          fontWeight: '600',
          textAlign: 'center',
          lineHeight: '1.2',
          marginBottom: '100px',
          color: '#000000'
        }}>
          ¡Tu registro en <span style={{ color: '#4CA772' }}>Plaze</span> fue exitoso!
        </h1>

        {/* Success message box with icon */}
        <div className="confirmation-box" style={{
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
          <div className="confirmation-text" style={{
            flex: 1,
            color: '#000000',
            fontSize: '18px',
            lineHeight: '1.6'
          }}>
            <p style={{ marginBottom: '16px' }}>
              <strong>¡Bienvenido a Plaze{userName ? `, ${userName}` : ''}!</strong>
            </p>
            <p style={{ marginBottom: '16px' }}>
              Tu cuenta ha sido creada exitosamente y ya puedes comenzar a disfrutar de toda la experiencia que Plaze tiene para ti.
            </p>
            <p>
              Descubre los mejores precios de productos en las plazas de mercado de tu ciudad y toma decisiones inteligentes de compra.
            </p>
          </div>
        </div>

        {/* Go to login button */}
        <button
          className="confirmation-button"
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
          Ir a Inicio de sesión
        </button>
      </div>
      </div>
    </>
  )
}

export default RegisterConfirmationPage

