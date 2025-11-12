import React from 'react'
import { TrendingUp, Calendar, DollarSign } from 'lucide-react'

/**
 * PricePredictionChart Component
 * Displays price predictions with visual graph
 */
const PricePredictionChart = ({ predictions, productName, monthsAhead }) => {
  if (!predictions || !predictions.predictions) {
    return null
  }

  const predData = predictions.predictions

  // Find min and max for scaling
  const allPrices = [
    ...(predData.historical || []).map(p => p.price),
    ...(predData.forecast || []).map(p => p.yhat)
  ]
  const minPrice = Math.min(...allPrices)
  const maxPrice = Math.max(...allPrices)
  const priceRange = maxPrice - minPrice

  // Calculate positions for visualization
  const getYPosition = (price) => {
    return 100 - ((price - minPrice) / priceRange) * 100
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .prediction-stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <div>
        {/* Stats Cards */}
        <div 
          className="prediction-stats-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            marginBottom: '2rem'
          }}
        >
          {/* Average Prediction */}
          <div style={{
            backgroundColor: '#E8F5E9',
            padding: '1.25rem',
            borderRadius: '12px',
            border: '2px solid #4CA772'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <DollarSign className="w-5 h-5" style={{ color: '#4CA772' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#2E7D32' }}>
                Precio Promedio Predicho
              </span>
            </div>
            <p style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1B5E20', margin: 0 }}>
              ${predData.avg_forecast?.toLocaleString('es-CO') || 'N/A'}/kg
            </p>
          </div>

          {/* Max Prediction */}
          <div style={{
            backgroundColor: '#FFF3E0',
            padding: '1.25rem',
            borderRadius: '12px',
            border: '2px solid #FF9800'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <TrendingUp className="w-5 h-5" style={{ color: '#F57C00' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#E65100' }}>
                Precio Máximo Esperado
              </span>
            </div>
            <p style={{ fontSize: '1.75rem', fontWeight: '700', color: '#E65100', margin: 0 }}>
              ${predData.max_forecast?.toLocaleString('es-CO') || 'N/A'}/kg
            </p>
          </div>

          {/* Min Prediction */}
          <div style={{
            backgroundColor: '#E3F2FD',
            padding: '1.25rem',
            borderRadius: '12px',
            border: '2px solid #2196F3'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Calendar className="w-5 h-5" style={{ color: '#1976D2' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0D47A1' }}>
                Precio Mínimo Esperado
              </span>
            </div>
            <p style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0D47A1', margin: 0 }}>
              ${predData.min_forecast?.toLocaleString('es-CO') || 'N/A'}/kg
            </p>
          </div>
        </div>

        {/* Prediction Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '2px solid #E0E0E0',
          overflow: 'hidden'
        }}>
          <div style={{
            backgroundColor: '#4CA772',
            padding: '1rem 1.5rem',
            color: 'white'
          }}>
            <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
              📊 Predicciones para los próximos {monthsAhead} meses
            </h4>
          </div>
          
          <div style={{ padding: '1.5rem', maxHeight: '400px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E0E0E0' }}>
                  <th style={{ 
                    textAlign: 'left', 
                    padding: '0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    color: '#666'
                  }}>
                    Fecha
                  </th>
                  <th style={{ 
                    textAlign: 'right', 
                    padding: '0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    color: '#666'
                  }}>
                    Precio Predicho
                  </th>
                  <th style={{ 
                    textAlign: 'right', 
                    padding: '0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    color: '#666'
                  }}>
                    Rango Inferior
                  </th>
                  <th style={{ 
                    textAlign: 'right', 
                    padding: '0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    color: '#666'
                  }}>
                    Rango Superior
                  </th>
                </tr>
              </thead>
              <tbody>
                {predData.forecast && predData.forecast.map((pred, index) => (
                  <tr 
                    key={index}
                    style={{ 
                      borderBottom: '1px solid #F5F5F5',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9F9F9'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#333' }}>
                      {new Date(pred.ds).toLocaleDateString('es-CO', { 
                        year: 'numeric', 
                        month: 'long',
                        day: 'numeric'
                      })}
                    </td>
                    <td style={{ 
                      padding: '0.75rem', 
                      textAlign: 'right',
                      fontSize: '1rem',
                      fontWeight: '700',
                      color: '#4CA772'
                    }}>
                      ${Math.round(pred.yhat).toLocaleString('es-CO')}
                    </td>
                    <td style={{ 
                      padding: '0.75rem', 
                      textAlign: 'right',
                      fontSize: '0.875rem',
                      color: '#666'
                    }}>
                      ${Math.round(pred.yhat_lower).toLocaleString('es-CO')}
                    </td>
                    <td style={{ 
                      padding: '0.75rem', 
                      textAlign: 'right',
                      fontSize: '0.875rem',
                      color: '#666'
                    }}>
                      ${Math.round(pred.yhat_upper).toLocaleString('es-CO')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Note */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#FFF9E6',
          border: '1px solid #FFD54F',
          borderRadius: '8px',
          fontSize: '0.875rem',
          color: '#666'
        }}>
          <strong>Nota:</strong> Las predicciones son estimaciones basadas en datos históricos 
          y pueden variar según condiciones del mercado. Los rangos inferior y superior representan 
          el intervalo de confianza de la predicción.
        </div>
      </div>
    </>
  )
}

export default PricePredictionChart

