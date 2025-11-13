import React, { useState } from 'react'
import { TrendingUp, Calendar, DollarSign, ExternalLink, X } from 'lucide-react'

/**
 * PricePredictionChart Component
 * Displays price predictions with visual graph
 */
const PricePredictionChart = ({ predictions, productName, monthsAhead }) => {
  const [showGraph, setShowGraph] = useState(false)

  // Validate predictions data
  if (!predictions || !predictions.predictions || predictions.predictions.length === 0) {
    return null
  }

  const predData = predictions.predictions

  // Parse prices from backend format (removes "$" and converts "10.000,00" to number)
  const parsePrice = (priceStr) => {
    if (typeof priceStr === 'number') return priceStr
    return parseFloat(
      priceStr
        .replace('$', '')
        .replace(/\./g, '') // Remove thousands separator
        .replace(',', '.') // Convert decimal separator
    )
  }

  // Extract statistics from predictions array
  const prices = predData.map(p => parsePrice(p['Precio estimado (por Kg)']))
  const avgForecast = prices.reduce((a, b) => a + b, 0) / prices.length
  const maxForecast = Math.max(...prices)
  const minForecast = Math.min(...prices)

  // Graph URL from backend response
  const graphUrl = predictions.graph_url

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
              ${Math.round(avgForecast).toLocaleString('es-CO')}/kg
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
              ${Math.round(maxForecast).toLocaleString('es-CO')}/kg
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
              ${Math.round(minForecast).toLocaleString('es-CO')}/kg
            </p>
          </div>
        </div>

        {/* View Graph Button */}
        {graphUrl && (
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <button
              onClick={() => setShowGraph(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 2rem',
                backgroundColor: '#4CA772',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(76, 167, 114, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(76, 167, 114, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(76, 167, 114, 0.3)'
              }}
            >
              <ExternalLink className="w-5 h-5" />
              Ver Gráfico Interactivo de Predicción
            </button>
          </div>
        )}

        {/* Graph Modal */}
        {showGraph && graphUrl && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '1rem'
            }}
            onClick={() => setShowGraph(false)}
          >
            <div 
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                width: '90%',
                maxWidth: '1200px',
                height: '85vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div 
                style={{
                  padding: '1.5rem',
                  borderBottom: '2px solid #E0E0E0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#F9F9F9'
                }}
              >
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#333' }}>
                  📈 Gráfico de Predicción - {productName}
                </h3>
                <button
                  onClick={() => setShowGraph(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F0F0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <X className="w-6 h-6" style={{ color: '#666' }} />
                </button>
              </div>

              {/* Modal Content - iframe */}
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <iframe
                  src={graphUrl}
                  title="Prediction Graph"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                />
              </div>
            </div>
          </div>
        )}

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
                {predData.map((pred, index) => (
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
                      {new Date(pred.Fecha).toLocaleDateString('es-CO', { 
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
                      ${Math.round(parsePrice(pred['Precio estimado (por Kg)'])).toLocaleString('es-CO')}
                    </td>
                    <td style={{ 
                      padding: '0.75rem', 
                      textAlign: 'right',
                      fontSize: '0.875rem',
                      color: '#666'
                    }}>
                      ${Math.round(parsePrice(pred['Mínimo estimado'])).toLocaleString('es-CO')}
                    </td>
                    <td style={{ 
                      padding: '0.75rem', 
                      textAlign: 'right',
                      fontSize: '0.875rem',
                      color: '#666'
                    }}>
                      ${Math.round(parsePrice(pred['Máximo estimado'])).toLocaleString('es-CO')}
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

