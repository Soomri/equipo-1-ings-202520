import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Edit, CheckCircle, Loader2 } from 'lucide-react'
import { authService, plazaService } from '../config/api'

const AdminPlazasEditPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const plazaIdParam = searchParams.get('id')
  
  const currentUser = authService.getCurrentUser()
  const isAdmin = currentUser.role === 'admin'

  const [plazas, setPlazas] = useState([])
  const [selectedPlazaId, setSelectedPlazaId] = useState(plazaIdParam || '')
  const [isLoadingPlazas, setIsLoadingPlazas] = useState(true)
  const [isLoadingPlaza, setIsLoadingPlaza] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  // Form fields
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    ciudad: 'Medellín',
    latitud: '',
    longitud: '',
    estado: 'activa',
    horarios: '',
    numero_comerciantes: '',
    tipos_productos: '',
    datos_contacto: ''
  })

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

  // Load plazas list
  useEffect(() => {
    if (isAdmin) {
      loadPlazas()
    }
  }, [isAdmin])

  // Load plaza data when selected
  useEffect(() => {
    if (selectedPlazaId) {
      loadPlazaData()
    }
  }, [selectedPlazaId])

  const loadPlazas = async () => {
    setIsLoadingPlazas(true)
    try {
      const data = await plazaService.getAllPlazas()
      setPlazas(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error loading plazas:', error)
      setErrorMessage('Error al cargar las plazas')
    } finally {
      setIsLoadingPlazas(false)
    }
  }

  const loadPlazaData = async () => {
    setIsLoadingPlaza(true)
    setErrorMessage('')
    
    try {
      const plaza = plazas.find(p => p.plaza_id.toString() === selectedPlazaId)
      
      if (plaza) {
        // Parse coordinates from format "(lat, lng)"
        let lat = ''
        let lng = ''
        if (plaza.coordenadas) {
          if (typeof plaza.coordenadas === 'string') {
            const coordMatch = plaza.coordenadas.match(/\(([-\d.]+),\s*([-\d.]+)\)/)
            if (coordMatch) {
              lat = coordMatch[1]
              lng = coordMatch[2]
            }
          } else if (plaza.coordenadas.lat && plaza.coordenadas.lon) {
            lat = plaza.coordenadas.lat
            lng = plaza.coordenadas.lon
          }
        }
        
        setFormData({
          nombre: plaza.nombre || '',
          direccion: plaza.direccion || '',
          ciudad: plaza.ciudad || 'Medellín',
          latitud: lat,
          longitud: lng,
          estado: plaza.estado || 'activa',
          horarios: plaza.horarios || '',
          numero_comerciantes: plaza.numero_comerciantes || '',
          tipos_productos: plaza.tipos_productos || '',
          datos_contacto: plaza.datos_contacto || ''
        })
      }
    } catch (error) {
      console.error('Error loading plaza data:', error)
      setErrorMessage('Error al cargar los datos de la plaza')
    } finally {
      setIsLoadingPlaza(false)
    }
  }

  const handleBack = () => {
    navigate('/admin/plazas/list')
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    setErrorMessage('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!formData.nombre.trim() || !formData.direccion.trim()) {
        setErrorMessage('Por favor completa los campos obligatorios')
        setIsSubmitting(false)
        return
      }

      // Validate coordinates if provided
      if (formData.latitud || formData.longitud) {
        const lat = parseFloat(formData.latitud)
        const lng = parseFloat(formData.longitud)
        
        if (isNaN(lat) || lat < -90 || lat > 90) {
          setErrorMessage('La latitud debe ser un número entre -90 y 90')
          setIsSubmitting(false)
          return
        }

        if (isNaN(lng) || lng < -180 || lng > 180) {
          setErrorMessage('La longitud debe ser un número entre -180 y 180')
          setIsSubmitting(false)
          return
        }
      }

      // Prepare data for API
      const updateData = {
        nombre: formData.nombre.trim(),
        direccion: formData.direccion.trim(),
        ciudad: formData.ciudad.trim(),
        estado: formData.estado
      }

      // Add optional fields only if provided
      if (formData.latitud && formData.longitud) {
        updateData.coordenadas = `(${formData.latitud}, ${formData.longitud})`
      }
      
      if (formData.horarios.trim()) {
        updateData.horarios = formData.horarios.trim()
      }
      
      if (formData.numero_comerciantes) {
        updateData.numero_comerciantes = parseInt(formData.numero_comerciantes)
      }
      
      if (formData.tipos_productos.trim()) {
        updateData.tipos_productos = formData.tipos_productos.trim()
      }
      
      if (formData.datos_contacto.trim()) {
        updateData.datos_contacto = formData.datos_contacto.trim()
      }

      // Call API
      await plazaService.updatePlaza(parseInt(selectedPlazaId), updateData)
      
      setSuccessMessage(`Plaza "${formData.nombre}" actualizada exitosamente`)
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/admin/plazas/list')
      }, 2000)
      
    } catch (error) {
      console.error('Error updating plaza:', error)
      setErrorMessage(error.message || 'Error al actualizar la plaza. Intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!currentUser.isAuthenticated || !isAdmin) {
    return null
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .edit-container {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          .form-wrapper {
            padding: 30px 25px !important;
          }
        }
        @media (max-width: 580px) {
          .form-wrapper {
            padding: 25px 20px !important;
          }
        }
      `}</style>
    <div className="min-h-screen bg-gray-50">
        <div className="container edit-container" style={{ paddingTop: '6rem', paddingBottom: '2rem' }}>
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

          {/* Form Container */}
          <div className="form-wrapper" style={{
            maxWidth: '680px',
            margin: '0 auto',
            backgroundColor: '#F5F5F5',
            border: '1px solid rgba(0, 0, 0, 0.25)',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            borderRadius: '8px',
            padding: '40px 60px'
          }}>
            {/* Form Title */}
            <h2 style={{
              fontSize: '40px',
              fontWeight: '600',
              marginBottom: '35px',
              textAlign: 'center',
              lineHeight: '1.2'
            }}>
              <span style={{ color: '#000000' }}>Modificar </span>
              <span style={{ color: '#FF9800' }}>Plaza</span>
            </h2>

            {/* Icon */}
        <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '30px'
        }}>
          <div style={{
            backgroundColor: '#FF9800',
            borderRadius: '50%',
            padding: '20px',
                display: 'flex',
            alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Edit className="w-10 h-10" style={{ color: '#FFFFFF' }} />
              </div>
            </div>

            {/* Plaza Selector */}
            {isLoadingPlazas ? (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                marginBottom: '30px'
              }}>
                <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3" style={{ color: '#FF9800' }} />
                <p style={{ color: '#666' }}>Cargando plazas...</p>
              </div>
            ) : (
              <div style={{ width: '100%', marginBottom: '30px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  color: '#333'
                }}>
                  Seleccionar Plaza <span style={{ color: '#D32F2F' }}>*</span>
                </label>
                <select
                  value={selectedPlazaId}
                  onChange={(e) => setSelectedPlazaId(e.target.value)}
                  disabled={isLoadingPlaza || isSubmitting}
                  style={{
                    width: '100%',
                    height: '60px',
                    backgroundColor: 'rgba(217, 217, 217, 0.5)',
                    border: '2px solid #FF9800',
                    borderRadius: '4px',
                    padding: '0 15px',
                    fontSize: '18px',
                    color: '#1a1a1a',
                    cursor: isLoadingPlaza || isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  <option value="">-- Selecciona una plaza para editar --</option>
                  {plazas.map((plaza) => (
                    <option key={plaza.plaza_id} value={plaza.plaza_id}>
                      {plaza.nombre} - {plaza.ciudad} (ID: {plaza.plaza_id})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Loading Plaza Data */}
            {isLoadingPlaza && (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                backgroundColor: '#FFF3E0',
                borderRadius: '8px',
            marginBottom: '20px'
          }}>
                <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3" style={{ color: '#FF9800' }} />
                <p style={{ color: '#E65100' }}>Cargando datos de la plaza...</p>
              </div>
            )}

            {/* Form Fields - Only show if plaza is selected and loaded */}
            {selectedPlazaId && !isLoadingPlaza && (
              <>
                <div style={{
                  backgroundColor: '#FFF3E0',
                  padding: '12px',
                  borderRadius: '6px',
                  marginBottom: '25px',
                  textAlign: 'center',
                  fontSize: '14px',
                  color: '#E65100'
                }}>
                  Modifica los campos que desees actualizar
                </div>

                {/* Nombre */}
                <div style={{ width: '100%', marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '500',
                    marginBottom: '8px',
                    color: '#333'
                  }}>
                    Nombre de la Plaza <span style={{ color: '#D32F2F' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      height: '50px',
                      backgroundColor: 'rgba(217, 217, 217, 0.5)',
                      border: '1px solid #000000',
                      borderRadius: '4px',
                      padding: '0 15px',
                      fontSize: '16px',
                      color: '#1a1a1a'
                    }}
                  />
                </div>

                {/* Direccion */}
                <div style={{ width: '100%', marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '500',
                    marginBottom: '8px',
                    color: '#333'
                  }}>
                    Dirección <span style={{ color: '#D32F2F' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      height: '50px',
                      backgroundColor: 'rgba(217, 217, 217, 0.5)',
                      border: '1px solid #000000',
                      borderRadius: '4px',
                      padding: '0 15px',
                      fontSize: '16px',
                      color: '#1a1a1a'
                    }}
                  />
                </div>

                {/* Ciudad (disabled) */}
                <div style={{ width: '100%', marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '500',
                    marginBottom: '8px',
                    color: '#333'
                  }}>
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value="Medellín"
                    disabled
                    style={{
                      width: '100%',
                      height: '50px',
                      backgroundColor: 'rgba(217, 217, 217, 0.3)',
                      border: '1px solid #999',
                      borderRadius: '4px',
                      padding: '0 15px',
                      fontSize: '16px',
                      color: '#666',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>

                {/* Coordenadas */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{
                      display: 'block',
                      fontSize: '16px',
                      fontWeight: '500',
                      marginBottom: '8px',
                      color: '#333'
                    }}>
                      Latitud
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="latitud"
                      value={formData.latitud}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        height: '50px',
                        backgroundColor: 'rgba(217, 217, 217, 0.5)',
                        border: '1px solid #000000',
                        borderRadius: '4px',
                        padding: '0 15px',
                        fontSize: '16px',
                        color: '#1a1a1a'
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{
                      display: 'block',
                      fontSize: '16px',
                      fontWeight: '500',
                      marginBottom: '8px',
                      color: '#333'
                    }}>
                      Longitud
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="longitud"
                      value={formData.longitud}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        height: '50px',
                        backgroundColor: 'rgba(217, 217, 217, 0.5)',
                        border: '1px solid #000000',
                        borderRadius: '4px',
                        padding: '0 15px',
                        fontSize: '16px',
                        color: '#1a1a1a'
                      }}
                    />
                  </div>
                </div>

                {/* Estado */}
                <div style={{ width: '100%', marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '500',
                    marginBottom: '8px',
                    color: '#333'
                  }}>
                    Estado
                  </label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      height: '50px',
                      backgroundColor: 'rgba(217, 217, 217, 0.5)',
                      border: '1px solid #000000',
                      borderRadius: '4px',
                      padding: '0 15px',
                      fontSize: '16px',
                      color: '#1a1a1a',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="activa">Activa</option>
                    <option value="inactiva">Inactiva</option>
                  </select>
                </div>

                {/* Horarios */}
                <div style={{ width: '100%', marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '500',
                    marginBottom: '8px',
                    color: '#333'
                  }}>
                    Horarios
                  </label>
                  <input
                    type="text"
                    name="horarios"
                    value={formData.horarios}
                    onChange={handleInputChange}
                    placeholder="Ej: Lun-Dom 6:00-18:00"
                    style={{
                      width: '100%',
                      height: '50px',
                      backgroundColor: 'rgba(217, 217, 217, 0.5)',
                      border: '1px solid #000000',
                      borderRadius: '4px',
                      padding: '0 15px',
                      fontSize: '16px',
                      color: '#1a1a1a'
                    }}
                  />
                </div>

                {/* Número de comerciantes */}
                <div style={{ width: '100%', marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '500',
                    marginBottom: '8px',
                    color: '#333'
                  }}>
                    Número de Comerciantes
                  </label>
                  <input
                    type="number"
                    name="numero_comerciantes"
                    value={formData.numero_comerciantes}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      height: '50px',
                      backgroundColor: 'rgba(217, 217, 217, 0.5)',
                      border: '1px solid #000000',
                      borderRadius: '4px',
                      padding: '0 15px',
                      fontSize: '16px',
                      color: '#1a1a1a'
                    }}
                  />
                </div>

                {/* Tipos de productos */}
                <div style={{ width: '100%', marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '500',
                    marginBottom: '8px',
                    color: '#333'
                  }}>
                    Tipos de Productos
                  </label>
                  <input
                    type="text"
                    name="tipos_productos"
                    value={formData.tipos_productos}
                    onChange={handleInputChange}
                    placeholder="Ej: Frutas, Verduras, Carnes"
                    style={{
                      width: '100%',
                      height: '50px',
                      backgroundColor: 'rgba(217, 217, 217, 0.5)',
                      border: '1px solid #000000',
                      borderRadius: '4px',
                      padding: '0 15px',
                      fontSize: '16px',
                      color: '#1a1a1a'
                    }}
                  />
                </div>

                {/* Datos de contacto */}
                <div style={{ width: '100%', marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '500',
                    marginBottom: '8px',
                    color: '#333'
                  }}>
                    Datos de Contacto
                  </label>
                  <input
                    type="text"
                    name="datos_contacto"
                    value={formData.datos_contacto}
                    onChange={handleInputChange}
                    placeholder="Teléfono o correo"
                    style={{
                      width: '100%',
                      height: '50px',
                      backgroundColor: 'rgba(217, 217, 217, 0.5)',
                      border: '1px solid #000000',
                      borderRadius: '4px',
                      padding: '0 15px',
                      fontSize: '16px',
                      color: '#1a1a1a'
                    }}
                  />
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
                    textAlign: 'center',
                    border: '1px solid #EF5350'
                  }}>
                    {errorMessage}
                  </div>
                )}

                {/* Success Message */}
                {successMessage && (
                  <div style={{
                    color: '#2E7D32',
                    backgroundColor: '#E8F5E9',
                    padding: '12px 20px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    marginBottom: '20px',
                    textAlign: 'center',
                    border: '1px solid #4CAF50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                    <CheckCircle className="w-5 h-5" />
                    {successMessage}
                  </div>
                )}

                {/* Form Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '15px',
                  justifyContent: 'center',
                  marginTop: '25px'
                }}>
                  <button
                    onClick={handleBack}
                    disabled={isSubmitting}
                    style={{
                      width: '180px',
                      height: '50px',
                      backgroundColor: '#F5F5F5',
                      border: '1px solid #999',
                      borderRadius: '20px',
                      color: '#333',
                      fontSize: '18px',
                      fontWeight: '500',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.15)',
                      opacity: isSubmitting ? 0.5 : 1
                    }}
                  >
                    Cancelar
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    style={{
                      width: '180px',
                      height: '50px',
                      backgroundColor: isSubmitting ? '#FFB74D' : '#FF9800',
                      border: 'none',
                      borderRadius: '20px',
                      color: '#FFFFFF',
                      fontSize: '18px',
            fontWeight: '600',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                      opacity: isSubmitting ? 0.7 : 1
                    }}
                  >
                    {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </>
            )}

            {/* No Plaza Selected Message */}
            {!selectedPlazaId && !isLoadingPlazas && (
          <div style={{
                textAlign: 'center',
                padding: '40px',
            backgroundColor: '#FFF3E0',
            borderRadius: '8px',
                border: '1px solid #FF9800'
              }}>
                <Edit className="w-12 h-12 mx-auto mb-3" style={{ color: '#F57C00' }} />
                <p style={{ color: '#E65100', fontSize: '16px' }}>
                  Selecciona una plaza para comenzar a editar
              </p>
            </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminPlazasEditPage
