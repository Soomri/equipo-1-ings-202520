import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
<<<<<<< HEAD
import { ArrowLeft, Search, Loader2, ShoppingBasket, TrendingUp, Filter, X, Store } from 'lucide-react'
=======
import { ArrowLeft, Search, Loader2, ShoppingBasket, TrendingUp } from 'lucide-react'
>>>>>>> b95f6a11bc92049b7ebac8e5edd8809f3c6e76ba
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
<<<<<<< HEAD
  const [selectedPlaza, setSelectedPlaza] = useState('')
  const [plazas, setPlazas] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  // Fetch products on mount
=======

>>>>>>> b95f6a11bc92049b7ebac8e5edd8809f3c6e76ba
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

<<<<<<< HEAD
  // Fetch plazas when filter is shown
  useEffect(() => {
    const fetchPlazas = async () => {
      if (showFilters && plazas.length === 0) {
        try {
          const response = await productService.getActivePlazas()
          const activePlazas = response.plazas.map(plaza => ({
            id: plaza.plaza_id,
            nombre: plaza.nombre,
            ciudad: plaza.ciudad
          }))
          setPlazas(activePlazas)
          console.log(`✅ Loaded ${activePlazas.length} active plazas`)
        } catch (error) {
          console.error('Error loading active plazas:', error)
        }
      }
    }

    fetchPlazas()
  }, [showFilters, plazas.length])

=======
>>>>>>> b95f6a11bc92049b7ebac8e5edd8809f3c6e76ba
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
<<<<<<< HEAD
    // If plaza is selected, pass it as query parameter
    if (selectedPlaza) {
      navigate(`/product/${encodeURIComponent(productName)}?plaza=${encodeURIComponent(selectedPlaza)}`)
    } else {
      navigate(`/product/${encodeURIComponent(productName)}`)
    }
  }

  const handleBack = () => {
    navigate('/home')
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const clearFilters = () => {
    setSelectedPlaza('')
=======
    navigate(`/product/${encodeURIComponent(productName)}`)
  }

  const handleBack = () => {
    navigate(-1)
>>>>>>> b95f6a11bc92049b7ebac8e5edd8809f3c6e76ba
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
<<<<<<< HEAD
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
=======
>>>>>>> b95f6a11bc92049b7ebac8e5edd8809f3c6e76ba
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

<<<<<<< HEAD
          {/* Search Bar and Filters */}
          <div style={{ marginBottom: '2rem' }}>
            {/* Search Bar */}
            <div style={{ position: 'relative', maxWidth: '600px', marginBottom: '1rem' }}>
=======
          {/* Search Bar */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ position: 'relative', maxWidth: '600px' }}>
>>>>>>> b95f6a11bc92049b7ebac8e5edd8809f3c6e76ba
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
<<<<<<< HEAD

            {/* Filter Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                type="button"
                onClick={toggleFilters}
                style={{ 
                  padding: '0.625rem 1.25rem',
                  borderRadius: '8px',
                  border: selectedPlaza ? '2px solid #4CA772' : (showFilters ? '1px solid #4CA772' : '1px solid #ddd'),
                  backgroundColor: selectedPlaza ? '#4CA772' : (showFilters ? '#E8F5E9' : 'transparent'),
                  color: selectedPlaza ? '#FFFFFF' : (showFilters ? '#2E7D32' : '#666'),
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s',
                  boxShadow: selectedPlaza ? '0 2px 8px rgba(76, 167, 114, 0.3)' : 'none'
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
                    {selectedPlaza && (
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
              {selectedPlaza && !showFilters && (
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
                  <span>{selectedPlaza}</span>
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

            {/* Filter Panel */}
            {showFilters && (
              <div 
                style={{
                  backgroundColor: '#f9f9f9',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginTop: '1rem',
                  border: '1px solid #e0e0e0',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                  animation: 'slideDown 0.3s ease-out'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Store className="w-5 h-5" style={{ color: '#4CA772' }} />
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#333', margin: 0 }}>
                      Filtrar por plaza de mercado
                    </h3>
                  </div>
                  {selectedPlaza && (
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

                <select
                  value={selectedPlaza}
                  onChange={(e) => setSelectedPlaza(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
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

                {selectedPlaza && (
                  <div 
                    style={{
                      padding: '0.75rem',
                      backgroundColor: '#E8F5E9',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      color: '#2E7D32',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginTop: '1rem'
                    }}
                  >
                    <Store className="w-4 h-4" />
                    <span>Filtrando por: <strong>{selectedPlaza}</strong></span>
                  </div>
                )}
              </div>
            )}
=======
>>>>>>> b95f6a11bc92049b7ebac8e5edd8809f3c6e76ba
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

