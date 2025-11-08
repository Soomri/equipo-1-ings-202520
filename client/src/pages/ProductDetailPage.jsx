import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, AlertCircle, Loader2, Store } from 'lucide-react'
import { productService } from '../config/api'
import PriceHistoryChart from '../components/PriceHistoryChart'
import PriceStats from '../components/PriceStats'
import TrendPeriods from '../components/TrendPeriods'

/**
 * ProductDetailPage Component
 * Displays detailed information about a product including:
 * - Price statistics
 * - Historical price chart
 * - Trend periods analysis
 * - Current prices by market plaza (filtered by selected plaza if specified)
 */
const ProductDetailPage = () => {
  const { productName } = useParams()
  const [searchParams] = useSearchParams()
  const selectedPlaza = searchParams.get('plaza')
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [historyData, setHistoryData] = useState(null)
  const [plazas, setPlazas] = useState([])
  const [currentPrices, setCurrentPrices] = useState([])
  const [months, setMonths] = useState(12)

  // Fetch data on component mount or when productName/months change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Fetch price history (includes all statistics)
        const history = await productService.getPriceHistory(productName, months)
        setHistoryData(history)

        // Fetch available plazas
        const optionsData = await productService.getOptions()
        const allPlazas = optionsData.plazas || []
        setPlazas(allPlazas)

        // Filter plazas based on selected plaza parameter
        const plazasToFetch = selectedPlaza 
          ? allPlazas.filter(p => p.nombre === selectedPlaza)
          : allPlazas

        // Fetch current prices for filtered plazas
        const pricesPromises = plazasToFetch.map(async (plaza) => {
          try {
            const priceData = await productService.getLatestPrice(productName, plaza.nombre)
            return {
              plaza: plaza.nombre,
              ...priceData
            }
          } catch (err) {
            return null
          }
        })

        const prices = await Promise.all(pricesPromises)
        setCurrentPrices(prices.filter(p => p !== null))

      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err.message || 'Error al cargar los datos del producto')
      } finally {
        setLoading(false)
      }
    }

    if (productName) {
      fetchData()
    }
  }, [productName, months, selectedPlaza])

  const handleBack = () => {
    navigate('/home')
  }

  const handleMonthsChange = (newMonths) => {
    setMonths(newMonths)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ paddingTop: '6rem' }}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: '#4CA772' }} />
          <p className="text-xl text-muted">Cargando datos del producto...</p>
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

  // No data state
  if (!historyData) {
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
            <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#FF9800' }} />
            <h2 className="text-2xl font-bold mb-4">No hay datos disponibles</h2>
            <p className="text-lg text-muted">
              No se encontraron datos históricos para este producto.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @media (max-width: 992px) {
          .product-header {
            flex-direction: column !important;
            gap: 1rem !important;
          }
          .product-title {
            font-size: 2rem !important;
          }
          .product-stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .product-title {
            font-size: 1.75rem !important;
          }
          .product-content-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .product-title {
            font-size: 1.5rem !important;
          }
          .product-container {
            padding-top: 4rem !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
        }
      `}</style>
      <div className="min-h-screen bg-gray-50">
        <div className="container product-container" style={{ paddingTop: '6rem', paddingBottom: '2rem' }}>
          {/* Header with back button */}
          <div className="flex items-center justify-between mb-8 product-header">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleBack}
                className="btn btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <ArrowLeft className="w-5 h-5" />
                Volver
              </button>
              <div>
                <h1 className="text-4xl font-bold product-title" style={{ color: '#4CA772' }}>
                  {historyData.producto}
                </h1>
              {selectedPlaza && (
                <div 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginTop: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#E8F5E9',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    color: '#2E7D32'
                  }}
                >
                  <Store className="w-4 h-4" />
                  <span>Filtrando por: <strong>{selectedPlaza}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Time period selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted">Periodo:</span>
            {[3, 6, 12].map((m) => (
              <button
                key={m}
                onClick={() => handleMonthsChange(m)}
                className={months === m ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem'
                }}
              >
                {m} meses
              </button>
            ))}
          </div>
        </div>

        {/* Statistics Cards */}
        <PriceStats 
          estadisticas={historyData.estadisticas}
          tendenciaGeneral={historyData.tendencia_general}
        />

        {/* Price History Chart */}
        <div className="mb-8">
          <PriceHistoryChart 
            historial={historyData.historial}
            precioActual={historyData.estadisticas.precio_final}
          />
        </div>

        {/* Trend Periods */}
        {historyData.periodos && historyData.periodos.length > 0 && (
          <div className="mb-8">
            <TrendPeriods periodos={historyData.periodos} />
          </div>
        )}

        {/* Current Prices by Plaza */}
        {currentPrices.length > 0 && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 className="text-2xl font-semibold mb-6" style={{ color: '#4CA772' }}>
              🏪 {selectedPlaza ? `Precio Actual en ${selectedPlaza}` : 'Precios Actuales por Plaza'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentPrices.map((priceData, index) => (
                <div 
                  key={index}
                  style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    backgroundColor: '#f9f9f9',
                    border: '2px solid #eee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Store className="w-5 h-5" style={{ color: '#4CA772' }} />
                    <div>
                      <div className="font-semibold">{priceData.plaza}</div>
                      <div className="text-xs text-muted">
                        {new Date(priceData.ultima_actualizacion).toLocaleDateString('es-CO')}
                      </div>
                    </div>
                  </div>
                  <div className="text-xl font-bold" style={{ color: '#4CA772' }}>
                    ${priceData.precio_por_kg.toLocaleString('es-CO')}/kg
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-muted">
          <p>
            Datos del periodo: {new Date(historyData.fecha_inicio).toLocaleDateString('es-CO')} 
            {' - '}
            {new Date(historyData.fecha_fin).toLocaleDateString('es-CO')}
          </p>
          <p className="mt-2">
            Total de registros analizados: {historyData.estadisticas.total_registros}
          </p>
        </div>
      </div>
      </div>
    </>
  )
}

export default ProductDetailPage

