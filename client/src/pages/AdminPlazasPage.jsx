import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Store, AlertCircle } from 'lucide-react'
import { authService } from '../config/api'

const AdminPlazasPage = () => {
  const navigate = useNavigate()
  const currentUser = authService.getCurrentUser()
  // Backend returns 'admin' as the admin role
  const isAdmin = currentUser.role === 'admin'

  // Debug: Log user role
  console.log('AdminPlazasPage - Current user:', currentUser)
  console.log('AdminPlazasPage - Role:', currentUser.role, '| Is admin?', isAdmin)

  // Redirect if not admin
  useEffect(() => {
    if (!currentUser.isAuthenticated) {
      console.log('User not authenticated, redirecting to login')
      navigate('/login')
      return
    }
    
    if (!isAdmin) {
      console.log('User is not admin, redirecting to home')
      navigate('/home')
    }
  }, [isAdmin, currentUser.isAuthenticated, navigate])

  const handleBack = () => {
    navigate('/home')
  }

  if (!currentUser.isAuthenticated || !isAdmin) {
    return null
  }

  return (
    <>
      <style>{`
        @media (max-width: 992px) {
          .admin-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1rem !important;
          }
          .admin-title {
            font-size: 2rem !important;
          }
          .admin-badge {
            align-self: flex-start !important;
          }
          .admin-features-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
          }
        }
        @media (max-width: 768px) {
          .admin-container {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          .admin-title {
            font-size: 1.75rem !important;
          }
          .admin-card {
            padding: 30px !important;
          }
        }
        @media (max-width: 480px) {
          .admin-title {
            font-size: 1.5rem !important;
          }
          .admin-card {
            padding: 20px !important;
          }
          .admin-features-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <div className="min-h-screen bg-gray-50">
        <div className="container admin-container" style={{ paddingTop: '6rem', paddingBottom: '2rem' }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8 admin-header">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBack}
              className="btn btn-secondary"
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
              Volver al Inicio
            </button>
            <div>
              <h1 className="text-4xl font-bold admin-title" style={{ color: '#4CA772' }}>
                Administrar Plazas
              </h1>
              <p className="text-gray-600 mt-2">
                Panel de administración de plazas de mercado
              </p>
            </div>
          </div>
          
          {/* Admin Badge */}
          <div className="admin-badge" style={{
            backgroundColor: '#FF6B35',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: '700',
            padding: '8px 16px',
            borderRadius: '20px',
            letterSpacing: '0.5px',
            boxShadow: '0 2px 8px rgba(255, 107, 53, 0.3)',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Store className="w-4 h-4" />
            Modo Administrador
          </div>
        </div>

        {/* Info Banner */}
        <div style={{
          backgroundColor: '#E3F2FD',
          border: '1px solid #2196F3',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <AlertCircle className="w-6 h-6" style={{ color: '#1976D2', flexShrink: 0 }} />
          <div>
            <p style={{ color: '#1565C0', fontWeight: '600', marginBottom: '4px' }}>
              Página de administración en construcción
            </p>
            <p style={{ color: '#1976D2', fontSize: '14px' }}>
              Aquí podrás administrar las plazas de mercado del sistema. Esta funcionalidad estará disponible próximamente.
            </p>
          </div>
        </div>

        {/* Placeholder Content */}
        <div className="card admin-card" style={{ 
          padding: '40px', 
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Store className="w-16 h-16 mx-auto mb-4" style={{ color: '#4CA772' }} />
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#333' }}>
              Funcionalidades de Administración
            </h2>
            <p className="text-gray-600 mb-6" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Desde esta página podrás gestionar las plazas de mercado, agregar nuevas plazas,
              editar información existente y más.
            </p>
            <div className="admin-features-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginTop: '40px'
            }}>
              {/* Feature cards placeholders */}
              {['Gestionar Plazas', 'Agregar Plaza', 'Ver Estadísticas', 'Configuración'].map((feature, index) => (
                <div key={index} style={{
                  padding: '24px',
                  backgroundColor: '#F5F5F5',
                  borderRadius: '8px',
                  border: '1px solid #E0E0E0'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                    {feature}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#666' }}>
                    Funcionalidad disponible próximamente
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

export default AdminPlazasPage

