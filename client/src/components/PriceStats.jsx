import React from 'react'
import { TrendingUp, TrendingDown, Minus, DollarSign } from 'lucide-react'

/**
 * PriceStats Component
 * Displays statistical cards about price variations
 * @param {Object} estadisticas - Statistics object from the API
 * @param {String} tendenciaGeneral - General trend (Aumento/Disminución/Estabilidad)
 */
const PriceStats = ({ estadisticas, tendenciaGeneral }) => {
  // Determine trend icon and color
  const getTrendIcon = () => {
    if (tendenciaGeneral === 'Aumento') {
      return <TrendingUp className="w-8 h-8" />
    } else if (tendenciaGeneral === 'Disminución') {
      return <TrendingDown className="w-8 h-8" />
    } else {
      return <Minus className="w-8 h-8" />
    }
  }

  const getTrendColor = () => {
    if (tendenciaGeneral === 'Aumento') return '#F57C00'
    if (tendenciaGeneral === 'Disminución') return '#4CAF50'
    return '#555'
  }

  const formatPrice = (value) => {
    return `$${value.toLocaleString('es-CO')}`
  }

  const stats = [
    {
      label: 'Precio Actual',
      value: formatPrice(estadisticas.precio_final),
      icon: <DollarSign className="w-8 h-8" />,
      color: '#4CA772',
      bg: 'rgba(76, 167, 114, 0.1)'
    },
    {
      label: 'Variación',
      value: `${estadisticas.variacion_porcentual > 0 ? '+' : ''}${estadisticas.variacion_porcentual}%`,
      icon: getTrendIcon(),
      color: getTrendColor(),
      bg: tendenciaGeneral === 'Aumento' 
        ? 'rgba(245, 124, 0, 0.1)' 
        : tendenciaGeneral === 'Disminución'
        ? 'rgba(76, 175, 80, 0.1)'
        : 'rgba(85, 85, 85, 0.1)'
    },
    {
      label: 'Precio Promedio',
      value: formatPrice(estadisticas.precio_promedio),
      icon: <DollarSign className="w-8 h-8" />,
      color: '#555',
      bg: 'rgba(85, 85, 85, 0.1)'
    },
    {
      label: 'Tendencia',
      value: tendenciaGeneral,
      icon: getTrendIcon(),
      color: getTrendColor(),
      bg: tendenciaGeneral === 'Aumento' 
        ? 'rgba(245, 124, 0, 0.1)' 
        : tendenciaGeneral === 'Disminución'
        ? 'rgba(76, 175, 80, 0.1)'
        : 'rgba(85, 85, 85, 0.1)'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="card"
          style={{
            padding: '1.5rem',
            textAlign: 'center',
            backgroundColor: stat.bg,
            border: `2px solid ${stat.color}20`
          }}
        >
          <div 
            style={{ 
              color: stat.color,
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '0.5rem'
            }}
          >
            {stat.icon}
          </div>
          <div 
            className="text-2xl font-bold mb-2" 
            style={{ color: stat.color }}
          >
            {stat.value}
          </div>
          <div className="text-sm text-muted">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}

export default PriceStats

