import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Clock, Phone, Globe, AlertCircle, Loader2, CheckCircle, XCircle, Store } from 'lucide-react'
import { plazaService } from '../config/api'

/**
 * PlazaDetailPage Component
 * Displays detailed information about a specific plaza
 */
const PlazaDetailPage = () => {
  const { plazaName } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [plaza, setPlaza] = useState(null)

  useEffect(() => {
    const fetchPlazaDetails = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await plazaService.getPlazaByName(plazaName)
        setPlaza(response)
      } catch (err) {
        console.error('Error fetching plaza details:', err)
        setError(err.message || 'Error al cargar los datos de la plaza')
      } finally {
        setLoading(false)
      }
    }

    if (plazaName) {
      fetchPlazaDetails()
    }
  }, [plazaName])

  const handleBack = () => {
    navigate(-1)
  }

  const handleViewOnMap = () => {
    if (plaza && plaza.coordenadas) {
      const { lat, lon } = plaza.coordenadas
      window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ paddingTop: '6rem' }}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: '#4CA772' }} />
          <p className="text-xl text-muted">Cargando información de la plaza...</p>
        </div>
      </div>
    )
  }

  if (error || !plaza) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '2rem' }}>
          <button 
            onClick={handleBack}
            className="btn btn-secondary mb-6"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <div className="card p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold mb-4">Error al cargar plaza</h2>
            <p className="text-lg text-muted mb-6">{error || 'No se encontró la plaza'}</p>
            <button 
              onClick={() => navigate('/plazas')}
              className="btn"
              style={{
                backgroundColor: '#4CA772',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Ver todas las plazas
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @media (max-width: 992px) {
          .plaza-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <div className="min-h-screen bg-gray-50">
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '3rem' }}>
          {/* Back Button */}
          <button 
            onClick={handleBack}
            className="btn btn-secondary mb-6"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>

          {/* Plaza Header */}
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '2.5rem',
              marginBottom: '2rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: plaza.estado === 'activa' ? '2px solid #4CA772' : '2px solid #FF9800'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <Store className="w-12 h-12" style={{ color: '#4CA772' }} />
                  <h1 className="text-5xl font-bold" style={{ color: '#4CA772', lineHeight: 1.2, margin: 0 }}>
                    {plaza.nombre}
                  </h1>
                </div>
                {plaza.ciudad && (
                  <p style={{ fontSize: '1.25rem', color: '#666', margin: 0 }}>
                    {plaza.ciudad}
                  </p>
                )}
              </div>

              {/* Status Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                borderRadius: '20px',
                backgroundColor: plaza.estado === 'activa' ? '#E8F5E9' : '#FFE0B2',
                border: plaza.estado === 'activa' ? '2px solid #4CA772' : '2px solid #FF9800'
              }}>
                {plaza.estado === 'activa' ? (
                  <>
                    <CheckCircle className="w-6 h-6" style={{ color: '#4CA772' }} />
                    <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#2E7D32' }}>
                      Activa
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6" style={{ color: '#F57C00' }} />
                    <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#E65100' }}>
                      Inactiva
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Plaza Details Grid */}
          <div 
            className="plaza-detail-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '2rem',
              marginBottom: '2rem'
            }}
          >
            {/* Main Information */}
            <div 
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                border: '2px solid #E0E0E0'
              }}
            >
              <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#333', marginBottom: '1.5rem' }}>
                Información General
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Address */}
                {plaza.direccion && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <MapPin className="w-5 h-5" style={{ color: '#4CA772' }} />
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>
                        Dirección
                      </span>
                    </div>
                    <p style={{ fontSize: '1.125rem', color: '#333', margin: 0, paddingLeft: '1.75rem' }}>
                      {plaza.direccion}
                    </p>
                  </div>
                )}

                {/* Schedule */}
                {plaza.horarios && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <Clock className="w-5 h-5" style={{ color: '#4CA772' }} />
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>
                        Horarios
                      </span>
                    </div>
                    <p style={{ fontSize: '1.125rem', color: '#333', margin: 0, paddingLeft: '1.75rem', whiteSpace: 'pre-line' }}>
                      {plaza.horarios}
                    </p>
                  </div>
                )}

                {/* Phone */}
                {plaza.telefono && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <Phone className="w-5 h-5" style={{ color: '#4CA772' }} />
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>
                        Teléfono
                      </span>
                    </div>
                    <p style={{ fontSize: '1.125rem', color: '#333', margin: 0, paddingLeft: '1.75rem' }}>
                      {plaza.telefono}
                    </p>
                  </div>
                )}

                {/* Website */}
                {plaza.sitio_web && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <Globe className="w-5 h-5" style={{ color: '#4CA772' }} />
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>
                        Sitio Web
                      </span>
                    </div>
                    <a 
                      href={plaza.sitio_web.startsWith('http') ? plaza.sitio_web : `https://${plaza.sitio_web}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        fontSize: '1.125rem', 
                        color: '#4CA772', 
                        textDecoration: 'none',
                        paddingLeft: '1.75rem',
                        display: 'block'
                      }}
                    >
                      {plaza.sitio_web}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Map Card */}
            <div 
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                border: '2px solid #E0E0E0',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#333', marginBottom: '1.5rem' }}>
                Ubicación
              </h2>

              {plaza.coordenadas ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ 
                    backgroundColor: '#F5F5F5', 
                    borderRadius: '12px', 
                    padding: '1rem',
                    marginBottom: '1rem',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '200px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <MapPin className="w-16 h-16 mx-auto mb-2" style={{ color: '#4CA772' }} />
                      <p style={{ fontSize: '0.875rem', color: '#666', margin: 0 }}>
                        Lat: {plaza.coordenadas.lat}
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#666', margin: 0 }}>
                        Lon: {plaza.coordenadas.lon}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleViewOnMap}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      backgroundColor: '#4CA772',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3D8F5F'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CA772'}
                  >
                    Ver en Google Maps
                  </button>
                </div>
              ) : (
                <p style={{ fontSize: '0.875rem', color: '#999', textAlign: 'center', padding: '2rem' }}>
                  No hay coordenadas disponibles
                </p>
              )}
            </div>
          </div>

          {/* Additional Info */}
          {plaza.descripcion && (
            <div 
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                border: '2px solid #E0E0E0'
              }}
            >
              <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#333', marginBottom: '1rem' }}>
                Descripción
              </h2>
              <p style={{ fontSize: '1.125rem', color: '#666', lineHeight: '1.8', margin: 0 }}>
                {plaza.descripcion}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default PlazaDetailPage

