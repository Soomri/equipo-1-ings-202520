import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, Search, ArrowRight, Store } from 'lucide-react'
import { authService } from '../config/api'

const HomePage = () => {
  const navigate = useNavigate()
  const currentUser = authService.getCurrentUser()
  // Backend returns 'admin' as the admin role
  const isAdmin = currentUser.role === 'admin'
  
  // Debug: Log user role
  console.log('HomePage - Role:', currentUser.role, '| Is Admin:', isAdmin)

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 8px 24px rgba(76, 167, 114, 0.4);
          }
          50% {
            box-shadow: 0 8px 32px rgba(76, 167, 114, 0.6);
          }
        }
        @media (max-width: 1450px) {
          .home-hero-card {
            width: 95% !important;
            padding: 40px !important;
          }
          .home-content-card {
            width: 100% !important;
          }
        }
        @media (max-width: 992px) {
          .home-hero-card {
            height: auto !important;
            min-height: 800px !important;
            padding: 30px 20px !important;
          }
          .home-title {
            font-size: 3rem !important;
          }
          .home-subtitle {
            font-size: 1.125rem !important;
          }
          .home-content-card {
            flex-direction: column !important;
            height: auto !important;
            min-height: 400px !important;
            padding: 30px 20px !important;
          }
          .home-image-section {
            width: 100% !important;
            padding-right: 0 !important;
            margin-bottom: 20px !important;
          }
          .home-hero-image {
            width: 100% !important;
            max-width: 500px !important;
          }
          .home-text-section {
            width: 100% !important;
            padding-left: 0 !important;
          }
          .home-hero-text {
            font-size: 1.125rem !important;
            max-width: 100% !important;
          }
          .home-cta-text {
            font-size: 1.375rem !important;
          }
          .cta-button {
            padding: 20px 40px !important;
            fontSize: 24px !important;
          }
        }
        @media (max-width: 768px) {
          .home-title {
            font-size: 2.5rem !important;
          }
          .home-subtitle {
            font-size: 1rem !important;
          }
          .home-hero-image {
            height: 250px !important;
          }
          .home-hero-text {
            font-size: 1rem !important;
          }
          .home-cta-text {
            font-size: 1.125rem !important;
          }
          .cta-button {
            padding: 16px 32px !important;
            fontSize: 20px !important;
          }
        }
        @media (max-width: 480px) {
          .home-hero-card {
            padding: 20px 15px !important;
            border-radius: 12px !important;
          }
          .home-title {
            font-size: 2rem !important;
          }
          .home-subtitle {
            font-size: 0.875rem !important;
          }
          .home-content-card {
            border-radius: 12px !important;
            padding: 20px 15px !important;
          }
          .home-hero-image {
            height: 200px !important;
          }
          .home-cta-text {
            font-size: 1rem !important;
          }
          .cta-button {
            padding: 14px 28px !important;
            fontSize: 18px !important;
            gap: 8px !important;
          }
          .cta-button svg {
            width: 20px !important;
            height: 20px !important;
          }
        }
      `}</style>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="py-16 bg-gray-50" style={{ paddingBottom: '100px' }}>
          <div className="container flex justify-center">
            {/* Main Hero Card */}
            <div className="mb-8 home-hero-card" style={{ 
              width: '1400px', 
              height: '950px', 
              backgroundColor: 'rgba(248, 231, 176, 0.54)',
              borderRadius: '20px',
              padding: '50px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '40px'
            }}>
            {/* Title */}
            <h1 className="text-6xl font-bold mb-8 home-title" style={{ 
              color: '#4CA772',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
            }}>
              PLAZE
            </h1>

            {/* Subtitle */}
            <h2 className="text-xl font-semibold mb-12 text-black home-subtitle" style={{ marginTop: '-20px' }}>
              Compra mejor con información real
            </h2>

            {/* Content Card */}
            <div className="mb-8 home-content-card" style={{
              width: '1300px',
              height: '350px',
              backgroundColor: 'rgba(247, 224, 147, 0.7)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              padding: '40px',
              position: 'relative',
              marginTop: '30px'
            }}>
              {/* Left Half - Image */}
              <div className="w-1/2 pr-8 home-image-section" style={{ position: 'relative', zIndex: 1 }}>
                <img 
                  className="home-hero-image"
                  src="/client_images/Plaze-hero-background.jpg" 
                  alt="Plaze Hero Background" 
                  style={{
                    width: '90%',
                    height: '320px',
                    objectFit: 'cover',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                    position: 'relative',
                    zIndex: 2
                  }}
                />
              </div>

              {/* Right Half - Text */}
              <div className="w-1/2 pl-8 home-text-section" style={{ paddingLeft: '60px', position: 'relative', zIndex: 1 }}>
                <p className="text-white text-xl leading-relaxed home-hero-text" style={{ maxWidth: '500px', fontSize: '22px' }}>
                  Consulta precios actualizados de productos agrícolas en las principales plazas de mercado de Medellín.
                </p>
                <br />
                <p className="text-white text-xl leading-relaxed home-hero-text" style={{ maxWidth: '500px', fontSize: '22px' }}>
                  Busca tu producto y obtén información para tomar las mejores decisiones de compra.
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div style={{
              textAlign: 'center',
              marginBottom: '40px',
              marginTop: '40px'
            }}>
              <h3 className="home-cta-text" style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#2E7D32',
                marginBottom: '16px',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)'
              }}>
                ¿Listo para encontrar los mejores precios?
              </h3>
              <p className="home-hero-text" style={{
                fontSize: '20px',
                color: '#555',
                fontWeight: '400',
                marginBottom: '32px'
              }}>
                Explora nuestro catálogo completo de productos
              </p>

              {/* Big Call to Action Button */}
              <button
                onClick={() => navigate('/products')}
                className="cta-button"
                style={{
                  backgroundColor: '#4CA772',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '24px 60px',
                  fontSize: '28px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(76, 167, 114, 0.4)',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '16px',
                  letterSpacing: '0.5px',
                  animation: 'pulse 2s infinite'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#3D8F5F'
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)'
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(76, 167, 114, 0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#4CA772'
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(76, 167, 114, 0.4)'
                }}
              >
                <Search className="w-8 h-8" />
                Empieza a Buscar Productos
                <ArrowRight className="w-8 h-8" />
              </button>

              {/* Additional subtle text */}
              <p style={{
                fontSize: '16px',
                color: '#888',
                marginTop: '20px',
                fontStyle: 'italic'
              }}>
                Accede a precios actualizados y compara entre plazas
              </p>

              {/* Secondary Button - Ver Plazas */}
              <button
                onClick={() => navigate('/plazas')}
                style={{
                  marginTop: '16px',
                  backgroundColor: 'transparent',
                  color: '#4CA772',
                  border: '2px solid #4CA772',
                  borderRadius: '12px',
                  padding: '12px 32px',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#4CA772'
                  e.currentTarget.style.color = 'white'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#4CA772'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <Store className="w-6 h-6" />
                Ver Plazas Disponibles
              </button>
            </div>

            {/* Admin Button - Only visible for administrators */}
            {isAdmin && (
              <div style={{ 
                marginTop: '40px', 
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <button
                  onClick={() => navigate('/admin/plazas')}
                  style={{
                    backgroundColor: '#FF6B35',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px 32px',
                    fontSize: '18px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    letterSpacing: '0.3px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#FF5722'
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 6px 16px rgba(255, 107, 53, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#FF6B35'
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.3)'
                  }}
                >
                  <Settings className="w-5 h-5" />
                  Administrar Plazas
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      </div>
    </>
  )
}

export default HomePage
