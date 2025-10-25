import React from 'react'
import ProductSearch from '../components/ProductSearch'

const HomePage = () => {

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 bg-gray-50" style={{ paddingBottom: '100px' }}>
        <div className="container flex justify-center">
          {/* Main Hero Card */}
          <div className="mb-8" style={{ 
            width: '1400px', 
            height: '950px', 
            backgroundColor: 'rgba(248, 231, 176, 0.54)',
            borderRadius: '20px',
            padding: '50px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '40px'
          }}>
            {/* Title */}
            <h1 className="text-6xl font-bold mb-8" style={{ 
              color: '#4CA772',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
            }}>
              PLAZE
            </h1>

            {/* Subtitle */}
            <h2 className="text-xl font-semibold mb-12 text-black" style={{ marginTop: '-20px' }}>
              Compra mejor con información real
            </h2>

            {/* Content Card */}
            <div className="mb-8" style={{
              width: '1300px',
              height: '350px',
              backgroundColor: 'rgba(247, 224, 147, 0.7)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              padding: '40px',
              position: 'relative',
              marginTop: '30px'
            }}>
              {/* Left Half - Image */}
              <div className="w-1/2 pr-8" style={{ position: 'relative', zIndex: 1 }}>
                <img 
                  src="/client_images/Plaze-hero-background.jpg" 
                  alt="Plaze Hero Background" 
                  style={{
                    width: '90%',
                    height: '320px',
                    objectFit: 'cover',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                    position: 'relative',
                    zIndex: 2
                  }}
                />
              </div>

              {/* Right Half - Text */}
              <div className="w-1/2 pl-8" style={{ paddingLeft: '60px', position: 'relative', zIndex: 1 }}>
                <p className="text-white text-xl leading-relaxed" style={{ maxWidth: '500px', fontSize: '22px' }}>
                  Consulta precios actualizados de productos agrícolas en las principales plazas de mercado de Medellín.
                </p>
                <br />
                <p className="text-white text-xl leading-relaxed" style={{ maxWidth: '500px', fontSize: '22px' }}>
                  Busca tu producto y obtén información para tomar las mejores decisiones de compra.
                </p>
              </div>
            </div>

            {/* Call to Action before Search */}
            <div style={{
              textAlign: 'center',
              marginBottom: '30px',
              marginTop: '20px'
            }}>
              <h3 style={{
                fontSize: '28px',
                fontWeight: '600',
                color: '#2E7D32',
                marginBottom: '12px',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)'
              }}>
                ¿Qué producto estás buscando hoy?
              </h3>
              <p style={{
                fontSize: '18px',
                color: '#555',
                fontWeight: '400'
              }}>
                Ingresa el nombre del producto para consultar precios en tiempo real
              </p>
            </div>

            {/* Search Component */}
            <div className="w-full flex justify-center">
              <ProductSearch />
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default HomePage
