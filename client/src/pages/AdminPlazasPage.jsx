import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Store, List, Plus, Edit, Trash2 } from 'lucide-react'
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

  const adminOptions = [
    {
      id: 1,
      title: 'Ver Listado de Plazas',
      description: 'Consulta todas las plazas registradas en el sistema',
      icon: List,
      color: '#2196F3',
      path: '/admin/plazas/list'
    },
    {
      id: 2,
      title: 'Crear Nueva Plaza',
      description: 'Agrega una nueva plaza de mercado al sistema',
      icon: Plus,
      color: '#4CAF50',
      path: '/admin/plazas/create'
    },
    {
      id: 3,
      title: 'Modificar Plaza',
      description: 'Edita la información de una plaza existente',
      icon: Edit,
      color: '#FF9800',
      path: '/admin/plazas/edit'
    },
    {
      id: 4,
      title: 'Eliminar Plaza',
      description: 'Elimina una plaza del sistema',
      icon: Trash2,
      color: '#F44336',
      path: '/admin/plazas/delete'
    }
  ]

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
          .admin-options-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
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
        }
        @media (max-width: 480px) {
          .admin-title {
            font-size: 1.5rem !important;
          }
          .admin-options-grid {
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

          {/* Admin Options Grid */}
          <div className="admin-options-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '25px',
            marginTop: '40px'
          }}>
            {adminOptions.map((option) => {
              const Icon = option.icon
              return (
                <div 
                  key={option.id}
                  onClick={() => navigate(option.path)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '30px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    border: '2px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)'
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)'
                    e.currentTarget.style.borderColor = option.color
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
                    e.currentTarget.style.borderColor = 'transparent'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '20px'
                  }}>
                    {/* Icon */}
                    <div style={{
                      backgroundColor: option.color,
                      borderRadius: '12px',
                      padding: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Icon className="w-8 h-8" style={{ color: '#FFFFFF' }} />
                    </div>
                    
                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#333',
                        marginBottom: '10px'
                      }}>
                        {option.title}
                      </h3>
                      <p style={{
                        fontSize: '14px',
                        color: '#666',
                        lineHeight: '1.5'
                      }}>
                        {option.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Arrow indicator */}
                  <div style={{
                    marginTop: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    color: option.color,
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    <span>Ir a {option.title.toLowerCase()}</span>
                    <ArrowLeft style={{ 
                      width: '16px', 
                      height: '16px', 
                      transform: 'rotate(180deg)' 
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminPlazasPage
