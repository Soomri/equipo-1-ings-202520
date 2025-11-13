import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, Loader2, Store, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react'
import { plazaService } from '../config/api'

/**
 * PlazasListPage Component
 * Displays all available plazas with search functionality
 */
const PlazasListPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [plazas, setPlazas] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredPlazas, setFilteredPlazas] = useState([])

  useEffect(() => {
    const fetchPlazas = async () => {
      try {
        setLoading(true)
        const response = await plazaService.getAllPlazas()
        setPlazas(response)
        setFilteredPlazas(response)
      } catch (error) {
        console.error('Error loading plazas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlazas()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPlazas(plazas)
    } else {
      const filtered = plazas.filter(plaza =>
        plaza.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plaza.ciudad?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plaza.direccion?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredPlazas(filtered)
    }
  }, [searchQuery, plazas])

  const handlePlazaClick = (plazaName) => {
    navigate(`/plaza/${encodeURIComponent(plazaName)}`)
  }

  const handleBack = () => {
    navigate('/home')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ paddingTop: '6rem' }}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: '#4CA772' }} />
          <p className="text-xl text-muted">Cargando plazas...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .plaza-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .plaza-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 32px rgba(76, 167, 114, 0.25) !important;
        }
        .search-input:focus {
          outline: none;
          border-color: #4CA772;
          box-shadow: 0 0 0 3px rgba(76, 167, 114, 0.1);
        }
        @media (max-width: 992px) {
          .plazas-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
          }
        }
        @media (max-width: 768px) {
          .plazas-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <div className="min-h-screen bg-gray-50">
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '3rem' }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <button 
              onClick={handleBack}
              className="btn btn-secondary mb-4"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <ArrowLeft className="w-5 h-5" />
              Volver
            </button>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <Store className="w-10 h-10" style={{ color: '#4CA772' }} />
              <div>
                <h1 className="text-4xl font-bold" style={{ color: '#4CA772', margin: 0 }}>
                  Plazas de Mercado
                </h1>
                <p style={{ color: '#666', fontSize: '1.125rem', margin: '0.25rem 0 0 0' }}>
                  {filteredPlazas.length} plazas disponibles
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ position: 'relative', maxWidth: '600px' }}>
              <Search 
                className="w-5 h-5" 
                style={{ 
                  position: 'absolute', 
                  left: '1rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#999'
                }} 
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, ciudad o dirección..."
                className="search-input"
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem 0.875rem 3rem',
                  border: '2px solid #E0E0E0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  transition: 'all 0.2s'
                }}
              />
            </div>
          </div>

          {/* Plazas Grid */}
          {filteredPlazas.length > 0 ? (
            <div 
              className="plazas-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {filteredPlazas.map((plaza) => (
                <div
                  key={plaza.plaza_id}
                  className="plaza-card"
                  onClick={() => handlePlazaClick(plaza.nombre)}
                  style={{
                    backgroundColor: 'white',
                    border: plaza.estado === 'activa' ? '2px solid #E8F5E9' : '2px solid #FFE0B2',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {/* Plaza Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: '700', 
                        color: '#333',
                        margin: '0 0 0.5rem 0'
                      }}>
                        {plaza.nombre}
                      </h3>
                    </div>
                    {/* Status Badge */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      backgroundColor: plaza.estado === 'activa' ? '#E8F5E9' : '#FFE0B2',
                      border: plaza.estado === 'activa' ? '1px solid #4CA772' : '1px solid #FF9800'
                    }}>
                      {plaza.estado === 'activa' ? (
                        <>
                          <CheckCircle className="w-4 h-4" style={{ color: '#4CA772' }} />
                          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#2E7D32' }}>
                            Activa
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" style={{ color: '#F57C00' }} />
                          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#E65100' }}>
                            Inactiva
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Plaza Info */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {plaza.ciudad && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MapPin className="w-4 h-4" style={{ color: '#666' }} />
                        <span style={{ fontSize: '0.875rem', color: '#666' }}>
                          {plaza.ciudad}
                        </span>
                      </div>
                    )}

                    {plaza.direccion && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <MapPin className="w-4 h-4 mt-0.5" style={{ color: '#666', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.875rem', color: '#666', lineHeight: '1.4' }}>
                          {plaza.direccion}
                        </span>
                      </div>
                    )}

                    {plaza.horarios && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <Clock className="w-4 h-4 mt-0.5" style={{ color: '#666', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.875rem', color: '#666', lineHeight: '1.4' }}>
                          {plaza.horarios}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* View Details Button */}
                  <div 
                    style={{
                      marginTop: '1rem',
                      padding: '0.625rem 1.25rem',
                      backgroundColor: '#4CA772',
                      color: 'white',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      textAlign: 'center'
                    }}
                  >
                    Ver detalles
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div 
              style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                backgroundColor: 'white',
                borderRadius: '16px',
                border: '2px dashed #E0E0E0'
              }}
            >
              <Search className="w-16 h-16 mx-auto mb-4" style={{ color: '#CCC' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#666', marginBottom: '0.5rem' }}>
                No se encontraron plazas
              </h3>
              <p style={{ color: '#999' }}>
                Intenta con otro término de búsqueda
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default PlazasListPage

