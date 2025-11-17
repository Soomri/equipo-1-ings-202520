import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'

/**
 * PriceHistoryChart Component
 * Displays a line chart showing the historical price variation of a product
 * @param {Array} historial - Array of price history data points
 * @param {Number} precioActual - Current price to show as reference line
 */
const PriceHistoryChart = ({ historial, precioActual }) => {
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })
  }

  // Format price for tooltip
  const formatPrice = (value) => {
    return `$${value.toLocaleString('es-CO')}`
  }

  // Transform data for chart
  const chartData = historial.map(item => ({
    ...item,
    fecha_formatted: formatDate(item.fecha)
  }))

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <h3 className="text-2xl font-semibold mb-6" style={{ color: '#4CA772' }}>
        📈 Histórico de Precios
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart 
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis 
            dataKey="fecha_formatted" 
            tick={{ fontSize: 12 }}
            stroke="#555"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#555"
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip 
            formatter={(value) => formatPrice(value)}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '10px'
            }}
          />
          <Legend 
            wrapperStyle={{
              paddingTop: '20px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="precio_por_kg" 
            stroke="#4CA772" 
            strokeWidth={2}
            name="Precio por kg"
            dot={{ fill: '#4CA772', r: 4 }}
            activeDot={{ r: 6 }}
          />
          {precioActual && (
            <ReferenceLine 
              y={precioActual} 
              stroke="#FF9800" 
              strokeDasharray="3 3"
              strokeWidth={2}
              label={{ 
                value: `Actual: ${formatPrice(precioActual)}`, 
                position: 'right',
                fill: '#FF9800',
                fontSize: 12,
                fontWeight: 'bold'
              }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PriceHistoryChart

