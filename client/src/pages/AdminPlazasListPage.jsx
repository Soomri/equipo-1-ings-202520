import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Store, MapPin } from 'lucide-react'
import { authService, plazaService } from '../config/api'

const AdminPlazasListPage = () => {
  const navigate = useNavigate()
  const currentUser = authService.getCurrentUser()
  const isAdmin = currentUser.role === 'admin'

  const [plazas, setPlazas] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // Redirect if not admin
  useEffect(() => {
    if (!currentUser.isAuthenticated) {
      navigate('/login')
      return
    }
    
    if (!isAdmin) {
      navigate('/home')
    }
  }, [isAdmin, currentUser.isAuthenticated, navigate])

  // Load plazas on mount
  useEffect(() => {
    if (isAdmin) {
      loadPlazas()
    }
  }, [isAdmin])

  const loadPlazas = async () => {
    setIsLoading(true)
    try {
      const data = await plazaService.getMedellinMarkets()
      if (data.plazas) {
        setPlazas(data.plazas)
      }
    } catch (error) {
      console.error('Error loading plazas:', error)
      setErrorMessage('Error al cargar las plazas')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/admin/plazas')
  }

  if (!currentUser.isAuthenticated || !isAdmin) {
    return null
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .list-container {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          .list-title {
            font-size: 1.75rem !important;
          }
        }
        @media (max-width: 480px) {
          .list-title {
            font-size: 1.5rem !important;
          }
          .plazas-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <div className="min-h-screen bg-gray-50">
        <div className="container list-container" style={{ paddingTop: '6rem', paddingBottom: '2rem' }}>
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={handleBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '10px 20px',
                backgroundColor: '#E8F5E9',
                border: '1px solid #4CA772',
                borderRadius: '8px',
                color: '#2E7D32',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <ArrowLeft className="w-5 h-5" />
              Volver
            </button>
            <div>
              <h1 className="list-title" style={{ 
                fontSize: '32px', 
                fontWeight: '600', 
                color: '#4CA772',
                marginBottom: '5px'
              }}>
                Listado de Plazas
              </h1>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Plazas registradas en Medellín
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div style={{
              color: '#D32F2F',
              backgroundColor: '#FFEBEE',
              padding: '15px 20px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #EF5350'
            }}>
              {errorMessage}
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '60px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}>
              <p style={{ color: '#666', fontSize: '16px' }}>Cargando plazas...</p>
            </div>
          ) : (
            <>
              {/* Plazas List */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}>
                {plazas.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: '#666'
                  }}>
                    <Store className="w-16 h-16 mx-auto mb-4" style={{ color: '#CCC' }} />
                    <p style={{ fontSize: '18px', marginBottom: '8px' }}>
                      No hay plazas registradas
                    </p>
                    <p style={{ fontSize: '14px' }}>
                      Las plazas registradas aparecerán aquí.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="plazas-grid" style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                      gap: '20px'
                    }}>
                      {plazas.map((plaza) => (
                        <div key={plaza.id} style={{
                          backgroundColor: '#F9F9F9',
                          border: '1px solid #E0E0E0',
                          borderRadius: '8px',
                          padding: '20px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
                          e.currentTarget.style.transform = 'translateY(-2px)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = 'none'
                          e.currentTarget.style.transform = 'translateY(0)'
                        }}
                        >
                          <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px'
                          }}>
                            <div style={{
                              backgroundColor: '#4CA772',
                              borderRadius: '50%',
                              padding: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <MapPin className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                            </div>
                            
                            <div style={{ flex: 1 }}>
                              <h4 style={{
                                fontSize: '18px',
                                fontWeight: '600',
                                color: '#333',
                                marginBottom: '8px'
                              }}>
                                {plaza.nombre}
                              </h4>
                              
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '14px',
                                color: '#666',
                                marginBottom: '8px'
                              }}>
                                <MapPin className="w-4 h-4" style={{ color: '#999' }} />
                                <span>{plaza.ciudad}</span>
                              </div>
                              
                              <div style={{
                                marginTop: '12px',
                                paddingTop: '12px',
                                borderTop: '1px solid #E0E0E0',
                                fontSize: '12px',
                                color: '#999'
                              }}>
                                ID: {plaza.id}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Total Counter */}
                    <div style={{
                      marginTop: '25px',
                      padding: '15px',
                      backgroundColor: '#E8F5E9',
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: '#2E7D32',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>
                      Total de plazas registradas: <strong>{plazas.length}</strong>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default AdminPlazasListPage

