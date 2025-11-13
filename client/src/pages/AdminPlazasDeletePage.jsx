import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Trash2, AlertTriangle, X } from 'lucide-react'
import { authService, plazaService } from '../config/api'

const AdminPlazasDeletePage = () => {
  const navigate = useNavigate()
  const currentUser = authService.getCurrentUser()
  const isAdmin = currentUser.role === 'admin'

  const [plazas, setPlazas] = useState([])
  const [selectedPlazaId, setSelectedPlazaId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)

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
    try {
      const data = await plazaService.getAllPlazas()
      setPlazas(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error loading plazas:', error)
      setErrorMessage('Error al cargar las plazas')
    }
  }

  const handleBack = () => {
    navigate('/admin/plazas')
  }

  const handleDeleteClick = () => {
    if (!selectedPlazaId) {
      setErrorMessage('Por favor selecciona una plaza')
      return
    }
    setShowConfirmation(true)
    setErrorMessage('')
  }

  const handleConfirmDelete = async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const selectedPlaza = plazas.find(p => p.plaza_id.toString() === selectedPlazaId)
      
      // Call API to delete plaza
      await plazaService.deletePlaza(parseInt(selectedPlazaId))
      
      // Close confirmation and reset
      setShowConfirmation(false)
      setSelectedPlazaId('')
      
      // Show success message and redirect
      alert(`Plaza "${selectedPlaza?.nombre}" eliminada exitosamente`)
      navigate('/admin/plazas/list')
      
    } catch (error) {
      console.error('Error deleting plaza:', error)
      setErrorMessage(error.message || 'Error al eliminar la plaza. Intenta nuevamente.')
      setShowConfirmation(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelDelete = () => {
    setShowConfirmation(false)
  }

  const getSelectedPlaza = () => {
    return plazas.find(p => p.plaza_id.toString() === selectedPlazaId)
  }

  if (!currentUser.isAuthenticated || !isAdmin) {
    return null
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .delete-container {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
        }
      `}</style>
      <div className="min-h-screen bg-gray-50">
        <div className="container delete-container" style={{ paddingTop: '6rem', paddingBottom: '2rem', maxWidth: '700px' }}>
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
          </div>

          {/* Main Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '40px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '30px'
            }}>
              <div style={{
                backgroundColor: '#F44336',
                borderRadius: '50%',
                padding: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Trash2 className="w-8 h-8" style={{ color: '#FFFFFF' }} />
              </div>
              <div>
                <h1 style={{
                  fontSize: '28px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Eliminar Plaza
                </h1>
                <p style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>
                  Selecciona la plaza que deseas eliminar
                </p>
              </div>
            </div>

            {/* Warning Banner */}
            <div style={{
              backgroundColor: '#FFF3E0',
              border: '1px solid #FF9800',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '25px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <AlertTriangle className="w-5 h-5" style={{ color: '#F57C00', flexShrink: 0, marginTop: '2px' }} />
              <p style={{ color: '#E65100', fontSize: '14px', lineHeight: '1.5' }}>
                <strong>Advertencia:</strong> Esta acción no se puede deshacer. Asegúrate de seleccionar la plaza correcta antes de continuar.
              </p>
            </div>

            {/* Plaza Selector */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '500',
                marginBottom: '10px',
                color: '#333'
              }}>
                Seleccionar Plaza
              </label>
              <select
                value={selectedPlazaId}
                onChange={(e) => setSelectedPlazaId(e.target.value)}
                disabled={isLoading}
                style={{
                  width: '100%',
                  height: '60px',
                  backgroundColor: 'rgba(217, 217, 217, 0.5)',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  padding: '0 15px',
                  fontSize: '18px',
                  color: '#1a1a1a',
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                <option value="">-- Selecciona una plaza --</option>
                {plazas.map((plaza) => (
                  <option key={plaza.plaza_id} value={plaza.plaza_id}>
                    {plaza.nombre} - {plaza.ciudad} (ID: {plaza.plaza_id})
                  </option>
                ))}
              </select>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div style={{
                color: '#D32F2F',
                backgroundColor: '#FFEBEE',
                padding: '12px 20px',
                borderRadius: '4px',
                fontSize: '14px',
                marginBottom: '20px',
                border: '1px solid #EF5350'
              }}>
                {errorMessage}
              </div>
            )}

            {/* Delete Button */}
            <button
              onClick={handleDeleteClick}
              disabled={isLoading || !selectedPlazaId}
              style={{
                width: '100%',
                height: '50px',
                backgroundColor: !selectedPlazaId || isLoading ? '#FFCDD2' : '#F44336',
                border: 'none',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '18px',
                fontWeight: '600',
                cursor: !selectedPlazaId || isLoading ? 'not-allowed' : 'pointer',
                boxShadow: !selectedPlazaId || isLoading ? 'none' : '0px 4px 8px rgba(244, 67, 54, 0.3)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                opacity: !selectedPlazaId || isLoading ? 0.6 : 1
              }}
            >
              <Trash2 className="w-5 h-5" />
              Eliminar Plaza
            </button>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '30px',
              maxWidth: '500px',
              width: '100%',
              position: 'relative',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
            }}>
              {/* Close button */}
              <button
                onClick={handleCancelDelete}
                disabled={isLoading}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'none',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  color: '#666',
                  padding: '5px'
                }}
              >
                <X className="w-6 h-6" />
              </button>

              {/* Alert Icon */}
              <div style={{
                backgroundColor: '#FFEBEE',
                borderRadius: '50%',
                padding: '15px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <AlertTriangle className="w-10 h-10" style={{ color: '#F44336' }} />
              </div>

              {/* Title */}
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '15px'
              }}>
                Confirmar Eliminación
              </h2>

              {/* Message */}
              <p style={{
                color: '#666',
                fontSize: '16px',
                lineHeight: '1.6',
                marginBottom: '10px'
              }}>
                ¿Estás seguro que deseas eliminar la siguiente plaza?
              </p>

              {/* Plaza Info */}
              <div style={{
                backgroundColor: '#F5F5F5',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '25px',
                border: '1px solid #E0E0E0'
              }}>
                <p style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '5px'
                }}>
                  {getSelectedPlaza()?.nombre}
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#666'
                }}>
                  {getSelectedPlaza()?.ciudad} - ID: {getSelectedPlaza()?.plaza_id}
                </p>
              </div>

              <p style={{
                color: '#D32F2F',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '25px'
              }}>
                Esta acción no se puede deshacer.
              </p>

              {/* Buttons */}
              <div style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={handleCancelDelete}
                  disabled={isLoading}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#F5F5F5',
                    border: '1px solid #CCC',
                    borderRadius: '8px',
                    color: '#333',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.5 : 1
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isLoading}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: isLoading ? '#EF9A9A' : '#F44336',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {isLoading ? (
                    'Eliminando...'
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      Sí, Eliminar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default AdminPlazasDeletePage

