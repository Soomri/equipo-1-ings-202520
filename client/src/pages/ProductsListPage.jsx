import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, Loader2, ShoppingBasket, TrendingUp } from 'lucide-react'
import { productService } from '../config/api'

/**
 * ProductsListPage Component
 * Displays all available products in card format with current prices
 */
const ProductsListPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredProducts, setFilteredProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await productService.getAllProducts()
        const productsData = response.productos || []
        setProducts(productsData)
        setFilteredProducts(productsData)
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter(product =>
        product.nombre.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredProducts(filtered)
    }
  }, [searchQuery, products])

  const handleProductClick = (productName) => {
    navigate(`/product/${encodeURIComponent(productName)}`)
  }

  const handleBack = () => {
    navigate(-1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ paddingTop: '6rem' }}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: '#4CA772' }} />
          <p className="text-xl text-muted">Cargando productos...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .product-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .product-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 32px rgba(76, 167, 114, 0.25) !important;
        }
        .search-input:focus {
          outline: none;
          border-color: #4CA772;
          box-shadow: 0 0 0 3px rgba(76, 167, 114, 0.1);
        }
        @media (max-width: 992px) {
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)) !important;
          }
        }
        @media (max-width: 768px) {
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)) !important;
          }
          .product-card {
            padding: 1rem !important;
          }
        }
      `}</style>
      <div className="min-h-screen bg-gray-50">
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '3rem' }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <button 
              onClick={handleBack}
              className="btn btn-secondary mb-4"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <ArrowLeft className="w-5 h-5" />
              Volver
            </button>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <ShoppingBasket className="w-10 h-10" style={{ color: '#4CA772' }} />
              <div>
                <h1 className="text-4xl font-bold" style={{ color: '#4CA772', margin: 0 }}>
                  Catálogo de Productos
                </h1>
                <p style={{ color: '#666', fontSize: '1.125rem', margin: '0.25rem 0 0 0' }}>
                  {filteredProducts.length} productos disponibles
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ position: 'relative', maxWidth: '600px' }}>
              <Search 
                className="w-5 h-5" 
                style={{ 
                  position: 'absolute', 
                  left: '1rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#999'
                }} 
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos..."
                className="search-input"
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem 0.875rem 3rem',
                  border: '2px solid #E0E0E0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  transition: 'all 0.2s'
                }}
              />
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div 
              className="products-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={() => handleProductClick(product.nombre)}
                  style={{
                    backgroundColor: 'white',
                    border: '2px solid #E8F5E9',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                >
                  {/* Product Icon */}
                  <div 
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      backgroundColor: '#E8F5E9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem'
                    }}
                  >
                    <ShoppingBasket className="w-10 h-10" style={{ color: '#4CA772' }} />
                  </div>

                  {/* Product Name */}
                  <h3 style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '700', 
                    color: '#333',
                    margin: '0 0 0.75rem 0',
                    minHeight: '3rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {product.nombre}
                  </h3>

                  {/* Action Button */}
                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.625rem 1.25rem',
                      backgroundColor: '#4CA772',
                      color: 'white',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      marginTop: 'auto'
                    }}
                  >
                    <TrendingUp className="w-4 h-4" />
                    Ver Precios
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div 
              style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                backgroundColor: 'white',
                borderRadius: '16px',
                border: '2px dashed #E0E0E0'
              }}
            >
              <Search className="w-16 h-16 mx-auto mb-4" style={{ color: '#CCC' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#666', marginBottom: '0.5rem' }}>
                No se encontraron productos
              </h3>
              <p style={{ color: '#999' }}>
                Intenta con otro término de búsqueda
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ProductsListPage

