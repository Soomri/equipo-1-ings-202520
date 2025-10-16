import React from 'react'
import { useNavigate } from 'react-router-dom'

const LandingHeader = () => {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: 'rgba(76, 167, 114, 0.7)', position: 'relative', overflow: 'visible' }}>
      <div className="container" style={{ overflow: 'visible' }}>
        <div className="flex items-center justify-between" style={{ height: '100px', overflow: 'visible' }}>
          {/* Logo - Extends beyond the header */}
          <div className="flex items-center" style={{ position: 'relative', overflow: 'visible' }}>
            <img 
              src="/client_images/Plaze-Logo.png" 
              alt="Plaze Logo" 
              style={{ 
                height: '220px', 
                width: 'auto',
                objectFit: 'contain',
                position: 'relative',
                top: '40px',
                zIndex: 100,
                cursor: 'pointer'
              }}
              onClick={() => navigate('/')}
            />
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center" style={{ gap: '20px' }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                width: '180px',
                height: '50px',
                backgroundColor: '#D2EDCC',
                border: '2px solid #000000',
                borderRadius: '25px',
                color: '#000000',
                fontSize: '18px',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#C0E0B8'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#D2EDCC'
              }}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => navigate('/register')}
              style={{
                width: '180px',
                height: '50px',
                backgroundColor: '#F8E7B0',
                border: '2px solid #000000',
                borderRadius: '25px',
                color: '#000000',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#E6D49A'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#F8E7B0'
              }}
            >
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default LandingHeader

