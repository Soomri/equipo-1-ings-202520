import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, AlertCircle } from 'lucide-react'
import { authService } from '../config/api'

const AdminPlazasEditPage = () => {
  const navigate = useNavigate()
  const currentUser = authService.getCurrentUser()
  const isAdmin = currentUser.role === 'admin'

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

  const handleBack = () => {
    navigate('/admin/plazas')
  }

  if (!currentUser.isAuthenticated || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container" style={{ paddingTop: '6rem', paddingBottom: '2rem', maxWidth: '800px' }}>
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

        {/* Info Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            backgroundColor: '#FF9800',
            borderRadius: '50%',
            padding: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <Edit className="w-12 h-12" style={{ color: '#FFFFFF' }} />
          </div>
          
          <h1 style={{
            fontSize: '32px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '15px'
          }}>
            Modificar Plaza
          </h1>
          
          <div style={{
            backgroundColor: '#FFF3E0',
            border: '1px solid #FF9800',
            borderRadius: '8px',
            padding: '20px',
            marginTop: '30px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            textAlign: 'left'
          }}>
            <AlertCircle className="w-6 h-6" style={{ color: '#F57C00', flexShrink: 0 }} />
            <div>
              <p style={{ color: '#E65100', fontWeight: '600', marginBottom: '8px' }}>
                Funcionalidad en desarrollo
              </p>
              <p style={{ color: '#F57C00', fontSize: '14px', lineHeight: '1.5' }}>
                Esta página estará disponible próximamente. Aquí podrás seleccionar una plaza 
                existente y modificar su información.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPlazasEditPage

