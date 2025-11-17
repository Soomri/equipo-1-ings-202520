import React from 'react'
import { TrendingUp, TrendingDown, Minus, Clock, MapPin, Store } from 'lucide-react'

const PriceResults = ({ results }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-red-500" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-green-500" />
      default:
        return <Minus className="w-4 h-4 text-gray-500" />
    }
  }

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-red-600'
      case 'down':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const getTrendText = (trend, change) => {
    if (trend === 'stable') return 'Sin cambios'
    const sign = change > 0 ? '+' : ''
    return `${sign}${change}%`
  }

  // Sort prices from lowest to highest
  const sortedPrices = [...results.prices].sort((a, b) => a.price - b.price)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Precios de {results.product}
        </h2>
        <div className="flex items-center justify-center gap-4 text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{results.city}</span>
          </div>
          {results.plaza && (
            <div className="flex items-center gap-1">
              <Store className="w-4 h-4" />
              <span>{results.plaza}</span>
            </div>
          )}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPrices.map((priceData, index) => (
          <div key={index} className="card hover:shadow-md transition-shadow">
            <div className="card-body">
              {/* Plaza Name */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{priceData.plaza}</h3>
                <div className="flex items-center gap-1">
                  {getTrendIcon(priceData.trend)}
                  <span className={`text-sm font-medium ${getTrendColor(priceData.trend)}`}>
                    {getTrendText(priceData.trend, priceData.change)}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-primary-color mb-1">
                  {formatPrice(priceData.price)}
                </div>
                <div className="text-sm text-gray-600">
                  por {priceData.unit}
                </div>
              </div>

              {/* Last Update */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Actualizado: {formatDate(priceData.lastUpdate)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      {sortedPrices.length > 1 && (
        <div className="card">
          <div className="card-body">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Resumen de Precios
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatPrice(Math.min(...sortedPrices.map(p => p.price)))}
                </div>
                <div className="text-sm text-gray-600">Precio más bajo</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {formatPrice(Math.max(...sortedPrices.map(p => p.price)))}
                </div>
                <div className="text-sm text-gray-600">Precio más alto</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-color">
                  {formatPrice(
                    sortedPrices.reduce((sum, p) => sum + p.price, 0) / sortedPrices.length
                  )}
                </div>
                <div className="text-sm text-gray-600">Precio promedio</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <button className="btn btn-secondary">
          Ver Historial
        </button>
        <button className="btn btn-primary">
          Ver Predicciones
        </button>
      </div>
    </div>
  )
}

export default PriceResults
