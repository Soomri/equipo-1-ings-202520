import React from 'react'
import { TrendingUp, TrendingDown, Package, MapPin } from 'lucide-react'

const QuickStats = () => {
  const stats = [
    {
      icon: Package,
      label: 'Productos Disponibles',
      value: '500+',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: MapPin,
      label: 'Plazas de Mercado',
      value: '6',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: TrendingUp,
      label: 'Precios Actualizados',
      value: 'Diario',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: TrendingDown,
      label: 'Ahorro Promedio',
      value: '15%',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className={`w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
          </div>
          <div className={`text-2xl font-bold ${stat.color} mb-1`}>
            {stat.value}
          </div>
          <div className="text-sm text-gray-600">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}

export default QuickStats
