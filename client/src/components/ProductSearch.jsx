import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Filter, X, Store } from 'lucide-react'
import { productService } from '../config/api'

const ProductSearch = () => {
  const navigate = useNavigate()
  const [searchData, setSearchData] = useState({
    product: '',
    plaza: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const [plazas, setPlazas] = useState([])

  // Fetch available plazas when component mounts
  useEffect(() => {
    const fetchPlazas = async () => {
      try {
        const options = await productService.getOptions()
        setPlazas(options.plazas || [])
      } catch (error) {
        console.error('Error loading plazas:', error)
      }
    }
    fetchPlazas()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchData.product.trim()) {
      // Navigate to product detail page with optional plaza parameter
      const productName = searchData.product.trim()
      const params = new URLSearchParams()
      if (searchData.plaza) {
        params.append('plaza', searchData.plaza)
      }
      const queryString = params.toString()
      navigate(`/product/${encodeURIComponent(productName)}${queryString ? `?${queryString}` : ''}`)
    }
  }

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const clearFilters = () => {
    setSearchData(prev => ({
      ...prev,
      plaza: ''
    }))
  }

  return (
    <div className="bg-white rounded-lg p-10 mx-auto shadow-lg" style={{ width: '1100px' }}>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Filter Button - Above Search, Aligned Left */}
        <div className="flex items-center gap-3" style={{ marginLeft: '225px', marginBottom: '20px' }}>
          <button 
            type="button"
            onClick={toggleFilters}
            className="flex items-center gap-2 transition-all"
            style={{ 
              padding: '8px 18px',
              borderRadius: '8px',
              border: searchData.plaza ? '2px solid #4CA772' : (showFilters ? '1px solid #4CA772' : '1px solid #ddd'),
              backgroundColor: searchData.plaza ? '#4CA772' : (showFilters ? '#E8F5E9' : 'transparent'),
              color: searchData.plaza ? '#FFFFFF' : (showFilters ? '#2E7D32' : '#666'),
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: searchData.plaza ? '0 2px 8px rgba(76, 167, 114, 0.3)' : 'none'
            }}
          >
            {showFilters ? (
              <>
                <X className="w-4 h-4" />
                Ocultar filtros
              </>
            ) : (
              <>
                <Filter className="w-4 h-4" />
                Filtrar por plazas
                {searchData.plaza && (
                  <span style={{
                    backgroundColor: '#FFFFFF',
                    color: '#4CA772',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginLeft: '4px'
                  }}>
                    1
                  </span>
                )}
              </>
            )}
          </button>
          
          {/* Active Filter Badge */}
          {searchData.plaza && !showFilters && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              backgroundColor: '#E8F5E9',
              border: '1px solid #4CA772',
              borderRadius: '20px',
              fontSize: '13px',
              color: '#2E7D32',
              fontWeight: '500'
            }}>
              <Store className="w-4 h-4" />
              <span>{searchData.plaza}</span>
              <button
                type="button"
                onClick={clearFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0',
                  marginLeft: '4px'
                }}
                title="Quitar filtro"
              >
                <X className="w-4 h-4" style={{ color: '#F57C00' }} />
              </button>
            </div>
          )}
        </div>

        {/* Search Input - Centered */}
        <div className="flex flex-col items-center mb-6">
          <input
            type="text"
            value={searchData.product}
            onChange={(e) => handleInputChange('product', e.target.value)}
            placeholder="Buscar producto (ej: Tomate, Papa criolla...)"
            className="border border-gray-300 text-xl focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent"
            style={{ 
              borderRadius: '12px',
              width: '650px',
              paddingLeft: '24px',
              paddingRight: '24px',
              paddingTop: '12px',
              paddingBottom: '12px',
              color: '#1a1a1a',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
            }}
            required
          />
        </div>

        {/* Advanced Filters Section */}
        {showFilters && (
          <div 
            style={{
              backgroundColor: '#f9f9f9',
              borderRadius: '12px',
              padding: '2rem',
              marginTop: '1rem',
              marginBottom: '1rem',
              border: '1px solid #e0e0e0',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
              animation: 'slideDown 0.3s ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Store className="w-6 h-6" style={{ color: '#4CA772' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#333', margin: 0 }}>
                  Filtrar por plaza de mercado
                </h3>
              </div>
              {searchData.plaza && (
                <button
                  type="button"
                  onClick={clearFilters}
                  style={{
                    fontSize: '0.875rem',
                    color: '#F57C00',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '500',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <X className="w-4 h-4" />
                  Limpiar filtro
                </button>
              )}
            </div>

            {/* Plaza Selector */}
            <div style={{ marginBottom: '1rem' }}>
              <label 
                htmlFor="plaza-select"
                style={{ 
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  marginBottom: '0.75rem',
                  color: '#555'
                }}
              >
                Selecciona una plaza específica (opcional):
              </label>
              <select
                id="plaza-select"
                value={searchData.plaza}
                onChange={(e) => handleInputChange('plaza', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  color: '#333'
                }}
                onFocus={(e) => e.target.style.borderColor = '#4CA772'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              >
                <option value="">🏪 Todas las plazas de mercado</option>
                {plazas.map((plaza) => (
                  <option key={plaza.id} value={plaza.nombre}>
                    {plaza.nombre} - {plaza.ciudad}
                  </option>
                ))}
              </select>
            </div>

            {searchData.plaza && (
              <div 
                style={{
                  padding: '0.75rem',
                  backgroundColor: '#E8F5E9',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#2E7D32',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Store className="w-4 h-4" />
                <span>Buscando en: <strong>{searchData.plaza}</strong></span>
              </div>
            )}
          </div>
        )}

        {/* Search Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={!searchData.product.trim()}
            className="text-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: '#D2EDCC',
              color: '#333',
              borderRadius: '25px',
              width: '300px',
              paddingTop: '10px',
              paddingBottom: '10px'
            }}
          >
            Buscar precios
          </button>
        </div>
      </form>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default ProductSearch
