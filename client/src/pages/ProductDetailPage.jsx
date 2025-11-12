import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, AlertCircle, Loader2, Store, ChevronDown, ChevronUp, TrendingUp, BarChart3, DollarSign } from 'lucide-react'
import { productService } from '../config/api'
import PriceHistoryChart from '../components/PriceHistoryChart'
import PriceStats from '../components/PriceStats'
import TrendPeriods from '../components/TrendPeriods'
import PricePredictionChart from '../components/PricePredictionChart'
import ProductSuggestions from '../components/ProductSuggestions'
import ScrollToTop from '../components/ScrollToTop'

/**
 * ProductDetailPage Component (Restructured)
 * Displays product information with current price and expandable sections for:
 * - Historical price data
 * - Price predictions
 */
const ProductDetailPage = () => {
  const { productName } = useParams()
  const [searchParams] = useSearchParams()
  const selectedPlaza = searchParams.get('plaza')
  const navigate = useNavigate()
  
  // Main state
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPrice, setCurrentPrice] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [productNotFound, setProductNotFound] = useState(false)
  
  // Historical data state
  const [historyExpanded, setHistoryExpanded] = useState(false)
  const [historyData, setHistoryData] = useState(null)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState(null)
  const [months, setMonths] = useState(12)
  const [customMonths, setCustomMonths] = useState('')
  
  // Prediction data state
  const [predictionExpanded, setPredictionExpanded] = useState(false)
  const [predictionData, setPredictionData] = useState(null)
  const [predictionLoading, setPredictionLoading] = useState(false)
  const [predictionError, setPredictionError] = useState(null)
  const [predictionMonths, setPredictionMonths] = useState(6)
  const [customPredictionMonths, setCustomPredictionMonths] = useState('')

  // Initial load - check if product exists and get current price
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true)
      setError(null)
      setSuggestions([])
      setProductNotFound(false)
      
      try {
        // Step 1: Try to fetch current price directly - this is the real validation
        const optionsData = await productService.getOptions()
        const allPlazas = optionsData.plazas || []
        
        if (!allPlazas || allPlazas.length === 0) {
          throw new Error('No hay plazas disponibles')
        }

        // Get price from selected plaza or first available
        const plazaToFetch = selectedPlaza 
          ? allPlazas.find(p => p.nombre === selectedPlaza) 
          : allPlazas[0]

        if (!plazaToFetch) {
          throw new Error('No se pudo encontrar la plaza')
        }

        try {
          // Try to get the actual price - this confirms the product EXISTS
          const priceData = await productService.getLatestPrice(productName, plazaToFetch.nombre)
          
          // Success! Product exists and has a price
          setCurrentPrice({
            precio: priceData.precio_por_kg,
            plaza: priceData.plaza,
            fecha: priceData.ultima_actualizacion
          })
          setLoading(false)
          return
          
        } catch (priceError) {
          // Step 2: Price fetch failed - product might not exist or name is wrong
          // Now try to get suggestions using the search endpoint
          console.log('Price not available, trying to get suggestions...')
          
          const searchResult = await productService.searchProducts(productName)
          
          // Check if we got suggestions (404 error case)
          if (searchResult.error && searchResult.status === 404) {
            if (searchResult.sugerencias && searchResult.sugerencias.length > 0) {
              // We have suggestions - show them to the user
              console.log('✅ Sugerencias encontradas:', searchResult.sugerencias)
              setSuggestions(searchResult.sugerencias)
              setProductNotFound(true)
              setLoading(false)
              return
            } else {
              // No suggestions available
              console.log('❌ No se encontraron sugerencias')
              setProductNotFound(true)
              setLoading(false)
              return
            }
          }
          
          // searchResult exists but no error - this means it found SOMETHING
          // But the price fetch failed, so the product might exist but have no price data
          if (searchResult.resultados && searchResult.resultados.length > 0) {
            // Product exists in database but has no price
            setCurrentPrice({
              precio: null,
              plaza: plazaToFetch.nombre,
              fecha: null
            })
            setLoading(false)
            return
          }
          
          // If we get here, something unexpected happened
          console.error('Unexpected search result:', searchResult)
          setProductNotFound(true)
          setLoading(false)
          return
        }

      } catch (err) {
        console.error('Error fetching initial data:', err)
        setError(err.message || 'Error al cargar los datos del producto')
        setLoading(false)
      }
    }

    if (productName) {
      fetchInitialData()
    }
  }, [productName, selectedPlaza])

  // Fetch historical data when section is expanded
  useEffect(() => {
    const fetchHistoryData = async () => {
      if (!historyExpanded || historyData) return
      
      setHistoryLoading(true)
      setHistoryError(null)
      
      try {
        const history = await productService.getPriceHistory(productName, months)
        setHistoryData(history)
      } catch (err) {
        console.error('Error fetching history:', err)
        // Set a clear, user-friendly error message
        setHistoryError(err.message || 'Este producto no tiene datos históricos disponibles')
      } finally {
        setHistoryLoading(false)
      }
    }

    fetchHistoryData()
  }, [historyExpanded, productName, months, historyData])

  // Fetch prediction data when section is expanded
  useEffect(() => {
    const fetchPredictionData = async () => {
      if (!predictionExpanded || predictionData) return
      
      setPredictionLoading(true)
      setPredictionError(null)
      
      try {
        const prediction = await productService.getPricePredictions(productName, predictionMonths)
        setPredictionData(prediction)
      } catch (err) {
        console.error('Error fetching predictions:', err)
        // Set a clear, user-friendly error message
        setPredictionError(err.message || 'Este producto no tiene suficientes datos para generar predicciones')
      } finally {
        setPredictionLoading(false)
      }
    }

    fetchPredictionData()
  }, [predictionExpanded, productName, predictionMonths, predictionData])

  const handleBack = () => {
    navigate('/home')
  }

  const handleMonthsChange = (newMonths) => {
    setMonths(newMonths)
    setCustomMonths('') // Clear custom input when using preset
    setHistoryData(null) // Reset to fetch new data
  }

  const handleCustomMonthsApply = () => {
    const value = parseInt(customMonths)
    if (value >= 1 && value <= 120) {
      setMonths(value)
      setHistoryData(null) // Reset to fetch new data
    }
  }

  const handlePredictionMonthsChange = (newMonths) => {
    setPredictionMonths(newMonths)
    setCustomPredictionMonths('') // Clear custom input when using preset
    setPredictionData(null) // Reset to fetch new data
  }

  const handleCustomPredictionMonthsApply = () => {
    const value = parseInt(customPredictionMonths)
    if (value >= 1 && value <= 120) {
      setPredictionMonths(value)
      setPredictionData(null) // Reset to fetch new data
    }
  }

  const toggleHistory = () => {
    setHistoryExpanded(!historyExpanded)
  }

  const togglePrediction = () => {
    setPredictionExpanded(!predictionExpanded)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ paddingTop: '6rem' }}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: '#4CA772' }} />
          <p className="text-xl text-muted">Cargando información del producto...</p>
        </div>
      </div>
    )
  }

  // Product not found with suggestions
  if (productNotFound && suggestions.length > 0) {
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
          
          <ProductSuggestions 
            suggestions={suggestions} 
            originalQuery={productName}
          />

          <div className="text-center" style={{ marginTop: '2rem' }}>
            <button
              onClick={() => navigate('/products')}
              className="btn"
              style={{
                backgroundColor: '#4CA772',
                color: 'white',
                padding: '1rem 2rem',
                fontSize: '1.125rem',
                fontWeight: '600',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Ver Catálogo Completo
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Product not found without suggestions
  if (productNotFound && suggestions.length === 0) {
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
          
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '3rem 2rem',
              textAlign: 'center',
              border: '2px solid #FFE0B2'
            }}
          >
            <AlertCircle className="w-20 h-20 mx-auto mb-4" style={{ color: '#FF9800' }} />
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#333' }}>
              Producto no encontrado
            </h2>
            <p className="text-lg mb-6" style={{ color: '#666' }}>
              No encontramos el producto <strong>"{productName}"</strong> en nuestro catálogo.
            </p>
            
            <button
              onClick={() => navigate('/products')}
              className="btn"
              style={{
                backgroundColor: '#4CA772',
                color: 'white',
                padding: '1.125rem 2.5rem',
                fontSize: '1.25rem',
                fontWeight: '600',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Ver Todos los Productos
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '2rem' }}>
          <button 
            onClick={handleBack}
            className="btn btn-secondary mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <div className="card p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold mb-4">Error al cargar datos</h2>
            <p className="text-lg text-muted mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Intentar nuevamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .section-header {
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .section-header:hover {
          background-color: #F5F5F5 !important;
        }
        .expandable-content {
          transition: all 0.3s ease;
          overflow: hidden;
        }
        @media (max-width: 992px) {
          .price-header-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .product-container {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
        }
      `}</style>
      <div className="min-h-screen bg-gray-50">
        <div className="container product-container" style={{ paddingTop: '6rem', paddingBottom: '3rem' }}>
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

          {/* PRODUCT HEADER WITH CURRENT PRICE */}
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '2.5rem',
              marginBottom: '2rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '2px solid #4CA772'
            }}
          >
            {/* Product Name */}
            <h1 className="text-5xl font-bold mb-4" style={{ color: '#4CA772', lineHeight: 1.2 }}>
              {productName}
                </h1>

            {/* Plaza Filter Badge */}
              {selectedPlaza && (
                <div 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  marginBottom: '1.5rem',
                  padding: '0.625rem 1.25rem',
                    backgroundColor: '#E8F5E9',
                    borderRadius: '20px',
                  fontSize: '0.9375rem',
                  color: '#2E7D32',
                  fontWeight: '600',
                  border: '2px solid #4CA772'
                }}
              >
                <Store className="w-5 h-5" />
                <span>Filtrando por: <strong>{selectedPlaza}</strong></span>
              </div>
            )}

            {/* Current Price Display */}
            <div 
              className="price-header-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '2rem',
                alignItems: 'center',
                marginTop: '1.5rem'
              }}
            >
              {/* Price */}
              <div>
                <p style={{ fontSize: '1.125rem', color: '#666', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Precio Actual:
                </p>
                {currentPrice && currentPrice.precio ? (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                    <span style={{ 
                      fontSize: '4rem', 
                      fontWeight: '800', 
                      color: '#4CA772',
                      lineHeight: 1
                    }}>
                      ${currentPrice.precio.toLocaleString('es-CO')}
                    </span>
                    <span style={{ fontSize: '1.75rem', color: '#666', fontWeight: '600' }}>
                      /kg
                    </span>
                  </div>
                ) : (
                  <p style={{ fontSize: '1.25rem', color: '#999', fontStyle: 'italic' }}>
                    Precio no disponible
                  </p>
                )}
                {currentPrice && currentPrice.fecha && (
                  <p style={{ fontSize: '0.9375rem', color: '#888', marginTop: '0.75rem' }}>
                    Última actualización: {new Date(currentPrice.fecha).toLocaleString('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>

              {/* Plaza Info */}
              {currentPrice && currentPrice.plaza && (
                <div 
                  style={{
                    backgroundColor: '#F5F5F5',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '2px solid #E0E0E0'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <Store className="w-6 h-6" style={{ color: '#4CA772' }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>
                      Plaza de Mercado
                    </span>
                  </div>
                  <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#333', margin: 0 }}>
                    {currentPrice.plaza}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* EXPANDABLE SECTION: HISTORICAL DATA */}
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              marginBottom: '1.5rem',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
              border: '2px solid #E0E0E0',
              overflow: 'hidden'
            }}
          >
            {/* Section Header */}
            <div 
              className="section-header"
              onClick={toggleHistory}
              style={{
                padding: '1.75rem 2rem',
                backgroundColor: '#F9F9F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: historyExpanded ? '2px solid #E0E0E0' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <BarChart3 className="w-7 h-7" style={{ color: '#4CA772' }} />
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#333', margin: 0 }}>
                    Histórico de Precios
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#666', margin: '0.25rem 0 0 0' }}>
                    Analiza la evolución de precios en el tiempo
                  </p>
                </div>
              </div>
              {historyExpanded ? (
                <ChevronUp className="w-6 h-6" style={{ color: '#666' }} />
              ) : (
                <ChevronDown className="w-6 h-6" style={{ color: '#666' }} />
              )}
            </div>

            {/* Section Content */}
            {historyExpanded && (
              <div className="expandable-content" style={{ padding: '2rem' }}>
                {/* Time period selector - Always visible */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#666' }}>Periodo:</span>
            {[3, 6, 12].map((m) => (
              <button
                key={m}
                onClick={() => handleMonthsChange(m)}
                style={{
                        padding: '0.625rem 1.25rem',
                        fontSize: '0.9375rem',
                        borderRadius: '8px',
                        border: months === m && !customMonths ? '2px solid #4CA772' : '2px solid #E0E0E0',
                        backgroundColor: months === m && !customMonths ? '#4CA772' : 'white',
                        color: months === m && !customMonths ? 'white' : '#666',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                }}
              >
                {m} meses
              </button>
            ))}
                  
                  {/* Custom months input */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#888' }}>o</span>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      placeholder="Ej: 24"
                      value={customMonths}
                      onChange={(e) => setCustomMonths(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleCustomMonthsApply()
                        }
                      }}
                      style={{
                        width: '80px',
                        padding: '0.625rem',
                        fontSize: '0.9375rem',
                        borderRadius: '8px',
                        border: '2px solid #E0E0E0',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#4CA772'}
                      onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                    />
                    <span style={{ fontSize: '0.875rem', color: '#666' }}>meses</span>
                    <button
                      onClick={handleCustomMonthsApply}
                      disabled={!customMonths || parseInt(customMonths) < 1 || parseInt(customMonths) > 120}
                      style={{
                        padding: '0.625rem 1rem',
                        fontSize: '0.875rem',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: customMonths && parseInt(customMonths) >= 1 && parseInt(customMonths) <= 120 ? '#4CA772' : '#E0E0E0',
                        color: 'white',
                        fontWeight: '600',
                        cursor: customMonths && parseInt(customMonths) >= 1 && parseInt(customMonths) <= 120 ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s',
                        opacity: customMonths && parseInt(customMonths) >= 1 && parseInt(customMonths) <= 120 ? 1 : 0.6
                      }}
                    >
                      Aplicar
                    </button>
          </div>
        </div>

                {/* Current selection indicator */}
                {![3, 6, 12].includes(months) && (
                  <div style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#E8F5E9',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    fontSize: '0.875rem',
                    color: '#2E7D32',
                    display: 'inline-block'
                  }}>
                    📅 Mostrando últimos <strong>{months} meses</strong>
                  </div>
                )}

                {/* Content States */}
                {historyLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3" style={{ color: '#4CA772' }} />
                    <p style={{ color: '#666' }}>Cargando datos históricos...</p>
                  </div>
                ) : historyError ? (
                  <div 
                    style={{
                      textAlign: 'center',
                      padding: '2rem',
                      backgroundColor: '#FFF3E0',
                      borderRadius: '12px',
                      border: '2px solid #FFD54F'
                    }}
                  >
                    <AlertCircle className="w-12 h-12 mx-auto mb-3" style={{ color: '#F57C00' }} />
                    <h4 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#E65100', marginBottom: '0.5rem' }}>
                      Sin datos históricos
                    </h4>
                    <p style={{ color: '#666', fontSize: '1rem', marginBottom: '0.5rem' }}>
                      {historyError}
                    </p>
                    <p style={{ color: '#888', fontSize: '0.875rem' }}>
                      Intenta seleccionar un periodo diferente arriba
                    </p>
                  </div>
                ) : historyData ? (
                  <>

        <PriceStats 
          estadisticas={historyData.estadisticas}
          tendenciaGeneral={historyData.tendencia_general}
        />

                    <div style={{ marginTop: '1.5rem' }}>
          <PriceHistoryChart 
            historial={historyData.historial}
            precioActual={historyData.estadisticas.precio_final}
          />
        </div>

        {historyData.periodos && historyData.periodos.length > 0 && (
                      <div style={{ marginTop: '1.5rem' }}>
            <TrendPeriods periodos={historyData.periodos} />
          </div>
        )}
                  </>
                ) : null}
              </div>
            )}
          </div>

          {/* EXPANDABLE SECTION: PRICE PREDICTIONS */}
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              marginBottom: '1.5rem',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
              border: '2px solid #E0E0E0',
              overflow: 'hidden'
            }}
          >
            {/* Section Header */}
            <div 
              className="section-header"
              onClick={togglePrediction}
                  style={{
                padding: '1.75rem 2rem',
                backgroundColor: '#F9F9F9',
                    display: 'flex',
                    alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: predictionExpanded ? '2px solid #E0E0E0' : 'none'
                  }}
                >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <TrendingUp className="w-7 h-7" style={{ color: '#4CA772' }} />
                    <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#333', margin: 0 }}>
                    Predicción de Precios
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#666', margin: '0.25rem 0 0 0' }}>
                    Proyección de precios futuros basada en IA
                  </p>
                      </div>
                    </div>
              {predictionExpanded ? (
                <ChevronUp className="w-6 h-6" style={{ color: '#666' }} />
              ) : (
                <ChevronDown className="w-6 h-6" style={{ color: '#666' }} />
              )}
                  </div>

            {/* Section Content */}
            {predictionExpanded && (
              <div className="expandable-content" style={{ padding: '2rem' }}>
                {/* Prediction period selector - Always visible */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#666' }}>Proyectar a:</span>
                  {[3, 6, 12].map((m) => (
                    <button
                      key={m}
                      onClick={() => handlePredictionMonthsChange(m)}
                      style={{
                        padding: '0.625rem 1.25rem',
                        fontSize: '0.9375rem',
                        borderRadius: '8px',
                        border: predictionMonths === m && !customPredictionMonths ? '2px solid #4CA772' : '2px solid #E0E0E0',
                        backgroundColor: predictionMonths === m && !customPredictionMonths ? '#4CA772' : 'white',
                        color: predictionMonths === m && !customPredictionMonths ? 'white' : '#666',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {m} meses
                    </button>
                  ))}
                  
                  {/* Custom months input */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#888' }}>o</span>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      placeholder="Ej: 18"
                      value={customPredictionMonths}
                      onChange={(e) => setCustomPredictionMonths(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleCustomPredictionMonthsApply()
                        }
                      }}
                      style={{
                        width: '80px',
                        padding: '0.625rem',
                        fontSize: '0.9375rem',
                        borderRadius: '8px',
                        border: '2px solid #E0E0E0',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#4CA772'}
                      onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                    />
                    <span style={{ fontSize: '0.875rem', color: '#666' }}>meses</span>
                    <button
                      onClick={handleCustomPredictionMonthsApply}
                      disabled={!customPredictionMonths || parseInt(customPredictionMonths) < 1 || parseInt(customPredictionMonths) > 120}
                      style={{
                        padding: '0.625rem 1rem',
                        fontSize: '0.875rem',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: customPredictionMonths && parseInt(customPredictionMonths) >= 1 && parseInt(customPredictionMonths) <= 120 ? '#4CA772' : '#E0E0E0',
                        color: 'white',
                        fontWeight: '600',
                        cursor: customPredictionMonths && parseInt(customPredictionMonths) >= 1 && parseInt(customPredictionMonths) <= 120 ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s',
                        opacity: customPredictionMonths && parseInt(customPredictionMonths) >= 1 && parseInt(customPredictionMonths) <= 120 ? 1 : 0.6
                      }}
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
                
                {/* Current selection indicator */}
                {![3, 6, 12].includes(predictionMonths) && (
                  <div style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#E8F5E9',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    fontSize: '0.875rem',
                    color: '#2E7D32',
                    display: 'inline-block'
                  }}>
                    🔮 Proyectando a <strong>{predictionMonths} meses</strong>
          </div>
        )}

                {/* Content States */}
                {predictionLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3" style={{ color: '#4CA772' }} />
                    <p style={{ color: '#666' }}>Generando predicciones...</p>
                  </div>
                ) : predictionError ? (
                  <div 
                    style={{
                      textAlign: 'center',
                      padding: '2rem',
                      backgroundColor: '#FFF3E0',
                      borderRadius: '12px',
                      border: '2px solid #FFD54F'
                    }}
                  >
                    <AlertCircle className="w-12 h-12 mx-auto mb-3" style={{ color: '#F57C00' }} />
                    <h4 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#E65100', marginBottom: '0.5rem' }}>
                      No se pueden generar predicciones
                    </h4>
                    <p style={{ color: '#666', fontSize: '1rem', marginBottom: '0.5rem' }}>
                      {predictionError}
                    </p>
                    <p style={{ color: '#888', fontSize: '0.875rem' }}>
                      Intenta seleccionar un periodo diferente arriba
                    </p>
                  </div>
                ) : predictionData ? (
                  <>

                    <PricePredictionChart 
                      predictions={predictionData}
                      productName={productName}
                      monthsAhead={predictionMonths}
                    />
                  </>
                ) : null}
              </div>
            )}
          </div>

        </div>

        {/* Scroll to Top Button */}
        <ScrollToTop />
      </div>
    </>
  )
}

export default ProductDetailPage
