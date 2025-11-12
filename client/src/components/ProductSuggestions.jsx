import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowRight } from 'lucide-react'

/**
 * ProductSuggestions Component
 * Displays product suggestions as clickable links
 * Used when a product search returns similar results
 */
const ProductSuggestions = ({ suggestions, originalQuery }) => {
  const navigate = useNavigate()

  const handleSuggestionClick = (productName) => {
    console.log('🔍 Navegando a producto:', productName)
    // Navigate to the suggested product
    navigate(`/product/${encodeURIComponent(productName)}`)
    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!suggestions || suggestions.length === 0) {
    return null
  }

  console.log('📋 Mostrando sugerencias:', suggestions)

  return (
    <>
      <style>{`
        .suggestion-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .suggestion-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(76, 167, 114, 0.2) !important;
        }
        @media (max-width: 768px) {
          .suggestions-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <div 
        style={{
          backgroundColor: '#FFF9E6',
          border: '2px solid #FFD54F',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <Search className="w-6 h-6" style={{ color: '#F57C00' }} />
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#333', margin: 0 }}>
              No encontramos "{originalQuery}"
            </h3>
            <p style={{ fontSize: '1rem', color: '#666', margin: '0.25rem 0 0 0' }}>
              ¿Quizás te referías a uno de estos productos?
            </p>
          </div>
        </div>

        <div 
          className="suggestions-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1rem'
          }}
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-card"
              onClick={() => handleSuggestionClick(suggestion.nombre)}
              style={{
                backgroundColor: 'white',
                border: '2px solid #E0E0E0',
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  color: '#333',
                  margin: 0,
                  marginBottom: '0.25rem'
                }}>
                  {suggestion.nombre}
                </p>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#4CA772',
                  fontWeight: '500',
                  margin: 0 
                }}>
                  Ver detalles
                </p>
              </div>
              <ArrowRight className="w-5 h-5" style={{ color: '#4CA772' }} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default ProductSuggestions

