import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Store, MapPin, Edit, Trash2, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react'
import { authService, plazaService } from '../config/api'

const AdminPlazasListPage = () => {
  const navigate = useNavigate()
  const currentUser = authService.getCurrentUser()
  const isAdmin = currentUser.role === 'admin'

  const [plazas, setPlazas] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [updatingStates, setUpdatingStates] = useState({}) // Track which plazas are being updated

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
      const data = await plazaService.getAllPlazas()
      setPlazas(Array.isArray(data) ? data : [])
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

  const handleToggleStatus = async (plaza) => {
    const plazaId = plaza.plaza_id
    const newStatus = plaza.estado === 'activa' ? 'inactiva' : 'activa'
    
    setUpdatingStates(prev => ({ ...prev, [plazaId]: true }))
    setErrorMessage('')

    try {
      await plazaService.updatePlaza(plazaId, { estado: newStatus })
      
      // Update local state
      setPlazas(prevPlazas =>
        prevPlazas.map(p =>
          p.plaza_id === plazaId ? { ...p, estado: newStatus } : p
        )
      )
    } catch (error) {
      console.error('Error updating plaza status:', error)
      setErrorMessage(`Error al cambiar el estado de "${plaza.nombre}": ${error.message}`)
    } finally {
      setUpdatingStates(prev => ({ ...prev, [plazaId]: false }))
    }
  }

  const handleEdit = (plazaId) => {
    navigate(`/admin/plazas/edit?id=${plazaId}`)
  }

  const handleDelete = (plazaId) => {
    navigate(`/admin/plazas/delete?id=${plazaId}`)
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
          .action-buttons {
            flex-direction: column !important;
            gap: 8px !important;
          }
          .action-buttons button {
            width: 100% !important;
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
                {plazas.length} plazas registradas
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
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: '#4CA772' }} />
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
                      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                      gap: '20px'
                    }}>
                      {plazas.map((plaza) => (
                        <div key={plaza.plaza_id} style={{
                          backgroundColor: '#F9F9F9',
                          border: plaza.estado === 'activa' ? '2px solid #E8F5E9' : '2px solid #FFE0B2',
                          borderRadius: '12px',
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
                            justifyContent: 'space-between',
                            marginBottom: '12px'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                              <div style={{
                                backgroundColor: plaza.estado === 'activa' ? '#4CA772' : '#FF9800',
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
                                  marginBottom: '4px'
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

                                {/* Status Badge */}
                                <span style={{
                                  display: 'inline-block',
                                  padding: '4px 10px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  backgroundColor: plaza.estado === 'activa' ? '#E8F5E9' : '#FFE0B2',
                                  color: plaza.estado === 'activa' ? '#2E7D32' : '#E65100'
                                }}>
                                  {plaza.estado === 'activa' ? 'Activa' : 'Inactiva'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="action-buttons" style={{
                            display: 'flex',
                            gap: '8px',
                            marginTop: '16px',
                            paddingTop: '16px',
                            borderTop: '1px solid #E0E0E0'
                          }}>
                            {/* Toggle Status Button */}
                            <button
                              onClick={() => handleToggleStatus(plaza)}
                              disabled={updatingStates[plaza.plaza_id]}
                              style={{
                                flex: 1,
                                padding: '10px',
                                backgroundColor: plaza.estado === 'activa' ? '#FFF3E0' : '#E8F5E9',
                                border: plaza.estado === 'activa' ? '1px solid #FF9800' : '1px solid #4CA772',
                                borderRadius: '8px',
                                color: plaza.estado === 'activa' ? '#E65100' : '#2E7D32',
                                fontSize: '13px',
                                fontWeight: '600',
                                cursor: updatingStates[plaza.plaza_id] ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                opacity: updatingStates[plaza.plaza_id] ? 0.6 : 1,
                                transition: 'all 0.2s'
                              }}
                            >
                              {updatingStates[plaza.plaza_id] ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : plaza.estado === 'activa' ? (
                                <ToggleRight className="w-4 h-4" />
                              ) : (
                                <ToggleLeft className="w-4 h-4" />
                              )}
                              {plaza.estado === 'activa' ? 'Desactivar' : 'Activar'}
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => handleEdit(plaza.plaza_id)}
                              style={{
                                flex: 1,
                                padding: '10px',
                                backgroundColor: '#E3F2FD',
                                border: '1px solid #2196F3',
                                borderRadius: '8px',
                                color: '#1565C0',
                                fontSize: '13px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#BBDEFB'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E3F2FD'}
                            >
                              <Edit className="w-4 h-4" />
                              Editar
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDelete(plaza.plaza_id)}
                              style={{
                                flex: 1,
                                padding: '10px',
                                backgroundColor: '#FFEBEE',
                                border: '1px solid #F44336',
                                borderRadius: '8px',
                                color: '#C62828',
                                fontSize: '13px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFCDD2'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFEBEE'}
                            >
                              <Trash2 className="w-4 h-4" />
                              Eliminar
                            </button>
                          </div>

                          {/* ID */}
                          <div style={{
                            marginTop: '12px',
                            fontSize: '12px',
                            color: '#999',
                            textAlign: 'center'
                          }}>
                            ID: {plaza.plaza_id}
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
