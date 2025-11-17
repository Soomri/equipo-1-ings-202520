import React from 'react'
import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react'

/**
 * TrendPeriods Component
 * Displays detected trend periods in the price history
 * @param {Array} periodos - Array of detected trend periods from the API
 */
const TrendPeriods = ({ periodos }) => {
  if (!periodos || periodos.length === 0) {
    return null
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-CO', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getTrendIcon = (tendencia) => {
    if (tendencia === 'Aumento') {
      return <TrendingUp className="w-5 h-5" />
    } else if (tendencia === 'Disminución') {
      return <TrendingDown className="w-5 h-5" />
    } else {
      return <Minus className="w-5 h-5" />
    }
  }

  const getTrendColor = (tendencia) => {
    if (tendencia === 'Aumento') return '#F57C00'
    if (tendencia === 'Disminución') return '#4CAF50'
    return '#555'
  }

  const getTrendBg = (tendencia) => {
    if (tendencia === 'Aumento') return 'rgba(245, 124, 0, 0.1)'
    if (tendencia === 'Disminución') return 'rgba(76, 175, 80, 0.1)'
    return 'rgba(85, 85, 85, 0.1)'
  }

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <h3 className="text-2xl font-semibold mb-6" style={{ color: '#4CA772' }}>
        📉 Periodos de Tendencia
      </h3>
      <div className="space-y-4">
        {periodos.map((periodo, index) => (
          <div 
            key={index}
            style={{
              padding: '1rem',
              borderRadius: '8px',
              backgroundColor: getTrendBg(periodo.tendencia),
              border: `2px solid ${getTrendColor(periodo.tendencia)}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ flex: 1 }}>
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}
              >
                <Calendar className="w-4 h-4 text-muted" />
                <span className="text-sm text-muted">
                  {formatDate(periodo.fecha_inicio)} - {formatDate(periodo.fecha_fin)}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ color: getTrendColor(periodo.tendencia) }}>
                  {getTrendIcon(periodo.tendencia)}
                </div>
                <span className="font-semibold" style={{ color: getTrendColor(periodo.tendencia) }}>
                  {periodo.tendencia}
                </span>
                <span className="text-sm text-muted">
                  ${periodo.precio_inicio.toLocaleString('es-CO')} → ${periodo.precio_fin.toLocaleString('es-CO')}
                </span>
              </div>
            </div>
            <div 
              className="text-lg font-bold"
              style={{ color: getTrendColor(periodo.tendencia) }}
            >
              {periodo.variacion_porcentual > 0 ? '+' : ''}{periodo.variacion_porcentual}%
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrendPeriods

