import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, CheckCircle } from 'lucide-react'
import { authService } from '../config/api'

const AdminPlazasCreatePage = () => {
  const navigate = useNavigate()
  const currentUser = authService.getCurrentUser()
  const isAdmin = currentUser.role === 'admin'

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  // Form fields
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    ciudad: '',
    latitud: '',
    longitud: '',
    estado: 'activa',
    numero_comerciantes: '',
    tipos_producto: '',
    numero_contacto: ''
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

  const handleBack = () => {
    navigate('/admin/plazas')
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
    setIsLoading(true)

    try {
      // Validate required fields
      if (!formData.nombre.trim() || !formData.direccion.trim() || !formData.ciudad.trim() || 
          !formData.latitud || !formData.longitud || !formData.estado) {
        setErrorMessage('Por favor completa todos los campos obligatorios')
        setIsLoading(false)
        return
      }

      // Validate coordinates
      const lat = parseFloat(formData.latitud)
      const lng = parseFloat(formData.longitud)
      
      if (isNaN(lat) || lat < -90 || lat > 90) {
        setErrorMessage('La latitud debe ser un número entre -90 y 90')
        setIsLoading(false)
        return
      }

      if (isNaN(lng) || lng < -180 || lng > 180) {
        setErrorMessage('La longitud debe ser un número entre -180 y 180')
        setIsLoading(false)
        return
      }

      // Simulate API call (will be replaced with actual API call later)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Plaza data to submit:', {
        nombre: formData.nombre.trim(),
        direccion: formData.direccion.trim(),
        ciudad: formData.ciudad.trim(),
        latitud: lat,
        longitud: lng,
        estado: formData.estado,
        numero_comerciantes: formData.numero_comerciantes ? parseInt(formData.numero_comerciantes) : null,
        tipos_producto: formData.tipos_producto.trim() || null,
        numero_contacto: formData.numero_contacto.trim() || null
      })
      
      setSuccessMessage(`Plaza "${formData.nombre}" creada exitosamente`)
      
      // Reset form
      setFormData({
        nombre: '',
        direccion: '',
        ciudad: '',
        latitud: '',
        longitud: '',
        estado: 'activa',
        numero_comerciantes: '',
        tipos_producto: '',
        numero_contacto: ''
      })

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/admin/plazas')
      }, 2000)
      
    } catch (error) {
      console.error('Error creating plaza:', error)
      setErrorMessage('Error al crear la plaza. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!currentUser.isAuthenticated || !isAdmin) {
    return null
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .create-container {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          .form-wrapper {
            padding: 30px 25px !important;
          }
          .input-wrapper {
            width: 100% !important;
          }
        }
        @media (max-width: 580px) {
          .form-wrapper {
            padding: 25px 20px !important;
          }
          .form-title {
            font-size: 32px !important;
          }
        }
      `}</style>
      <div className="min-h-screen bg-gray-50">
        <div className="container create-container" style={{ paddingTop: '6rem', paddingBottom: '2rem' }}>
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
            <h2 className="form-title" style={{
              fontSize: '40px',
              fontWeight: '600',
              marginBottom: '35px',
              textAlign: 'center',
              lineHeight: '1.2'
            }}>
              <span style={{ color: '#000000' }}>Agregar Nueva </span>
              <span style={{ color: '#4CA772' }}>Plaza</span>
            </h2>

            {/* Icon */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '30px'
            }}>
              <div style={{
                backgroundColor: '#4CA772',
                borderRadius: '50%',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MapPin className="w-10 h-10" style={{ color: '#FFFFFF' }} />
              </div>
            </div>

            {/* Required Fields Label */}
            <div style={{
              backgroundColor: '#E3F2FD',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '25px',
              textAlign: 'center',
              fontSize: '14px',
              color: '#1565C0'
            }}>
              <strong>Campos obligatorios:</strong> Nombre, Dirección, Ciudad, Coordenadas y Estado
            </div>

            {/* Form Fields - Required */}
            <div className="input-wrapper" style={{ width: '100%', marginBottom: '25px' }}>
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
                placeholder="Ej: Plaza Minorista"
                value={formData.nombre}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  height: '60px',
                  backgroundColor: 'rgba(217, 217, 217, 0.5)',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  padding: '0 15px',
                  fontSize: '18px',
                  color: '#1a1a1a'
                }}
              />
            </div>

            <div className="input-wrapper" style={{ width: '100%', marginBottom: '25px' }}>
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
                placeholder="Ej: Cra. 57 #31-80"
                value={formData.direccion}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  height: '60px',
                  backgroundColor: 'rgba(217, 217, 217, 0.5)',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  padding: '0 15px',
                  fontSize: '18px',
                  color: '#1a1a1a'
                }}
              />
            </div>

            <div className="input-wrapper" style={{ width: '100%', marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '500',
                marginBottom: '8px',
                color: '#333'
              }}>
                Ciudad <span style={{ color: '#D32F2F' }}>*</span>
              </label>
              <input
                type="text"
                name="ciudad"
                placeholder="Ej: Medellín"
                value={formData.ciudad}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  height: '60px',
                  backgroundColor: 'rgba(217, 217, 217, 0.5)',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  padding: '0 15px',
                  fontSize: '18px',
                  color: '#1a1a1a'
                }}
              />
            </div>

            {/* Coordinates Row */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  color: '#333'
                }}>
                  Latitud <span style={{ color: '#D32F2F' }}>*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  name="latitud"
                  placeholder="Ej: 6.25184"
                  value={formData.latitud}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    height: '60px',
                    backgroundColor: 'rgba(217, 217, 217, 0.5)',
                    border: '1px solid #000000',
                    borderRadius: '4px',
                    padding: '0 15px',
                    fontSize: '18px',
                    color: '#1a1a1a'
                  }}
                />
              </div>

              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  color: '#333'
                }}>
                  Longitud <span style={{ color: '#D32F2F' }}>*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  name="longitud"
                  placeholder="Ej: -75.56359"
                  value={formData.longitud}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    height: '60px',
                    backgroundColor: 'rgba(217, 217, 217, 0.5)',
                    border: '1px solid #000000',
                    borderRadius: '4px',
                    padding: '0 15px',
                    fontSize: '18px',
                    color: '#1a1a1a'
                  }}
                />
              </div>
            </div>

            <div className="input-wrapper" style={{ width: '100%', marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '500',
                marginBottom: '8px',
                color: '#333'
              }}>
                Estado <span style={{ color: '#D32F2F' }}>*</span>
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  height: '60px',
                  backgroundColor: 'rgba(217, 217, 217, 0.5)',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  padding: '0 15px',
                  fontSize: '18px',
                  color: '#1a1a1a',
                  cursor: 'pointer'
                }}
              >
                <option value="activa">Activa</option>
                <option value="inactiva">Inactiva</option>
              </select>
            </div>

            {/* Optional Fields Label */}
            <div style={{
              backgroundColor: '#FFF3E0',
              padding: '10px',
              borderRadius: '6px',
              marginBottom: '20px',
              textAlign: 'center',
              fontSize: '13px',
              color: '#E65100'
            }}>
              Campos opcionales
            </div>

            {/* Form Fields - Optional */}
            <div className="input-wrapper" style={{ width: '100%', marginBottom: '25px' }}>
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
                placeholder="Ej: 150"
                value={formData.numero_comerciantes}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  height: '60px',
                  backgroundColor: 'rgba(217, 217, 217, 0.5)',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  padding: '0 15px',
                  fontSize: '18px',
                  color: '#1a1a1a'
                }}
              />
            </div>

            <div className="input-wrapper" style={{ width: '100%', marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '500',
                marginBottom: '8px',
                color: '#333'
              }}>
                Tipos de Producto que Vende
              </label>
              <input
                type="text"
                name="tipos_producto"
                placeholder="Ej: Frutas, Verduras, Carnes, Lácteos"
                value={formData.tipos_producto}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  height: '60px',
                  backgroundColor: 'rgba(217, 217, 217, 0.5)',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  padding: '0 15px',
                  fontSize: '18px',
                  color: '#1a1a1a'
                }}
              />
            </div>

            <div className="input-wrapper" style={{ width: '100%', marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '500',
                marginBottom: '8px',
                color: '#333'
              }}>
                Número de Contacto
              </label>
              <input
                type="text"
                name="numero_contacto"
                placeholder="Ej: 3001234567"
                value={formData.numero_contacto}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  height: '60px',
                  backgroundColor: 'rgba(217, 217, 217, 0.5)',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  padding: '0 15px',
                  fontSize: '18px',
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
              marginTop: '25px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={handleBack}
                disabled={isLoading}
                style={{
                  width: '180px',
                  height: '50px',
                  backgroundColor: '#F5F5F5',
                  border: '1px solid #999',
                  borderRadius: '20px',
                  color: '#333',
                  fontSize: '20px',
                  fontWeight: '500',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.15)',
                  opacity: isLoading ? 0.5 : 1
                }}
              >
                Cancelar
              </button>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                style={{
                  width: '180px',
                  height: '50px',
                  backgroundColor: isLoading ? '#A8E88D' : '#D2EDCC',
                  border: 'none',
                  borderRadius: '20px',
                  color: '#000000',
                  fontSize: '20px',
                  fontWeight: '500',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                {isLoading ? 'Guardando...' : 'Guardar Plaza'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminPlazasCreatePage

