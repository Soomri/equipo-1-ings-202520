import React from 'react'
import { useNavigate } from 'react-router-dom'
import LandingHeader from '../components/LandingHeader'
import Footer from '../components/Footer'

const LandingPage = () => {
  const navigate = useNavigate()
  return (
    <>
      <style>{`
        @media (max-width: 1200px) {
          .landing-hero-section {
            width: 90% !important;
            padding: 40px 50px !important;
          }
          .landing-about-section {
            width: 90% !important;
            height: auto !important;
            padding: 20px 30px !important;
          }
          .landing-team-section {
            width: 90% !important;
            padding: 40px 40px !important;
          }
          .landing-legal-container {
            width: 90% !important;
          }
        }
        @media (max-width: 992px) {
          .landing-hero-title {
            font-size: 36px !important;
            max-width: 90% !important;
          }
          .landing-hero-section {
            width: 95% !important;
            height: auto !important;
            padding: 30px 30px !important;
          }
          .landing-plaze-title {
            font-size: 48px !important;
          }
          .landing-description {
            font-size: 22px !important;
          }
          .landing-features {
            flex-direction: column !important;
            gap: 30px !important;
          }
          .landing-feature-image {
            width: 300px !important;
            height: 300px !important;
          }
          .landing-feature-circle {
            width: 300px !important;
            height: 300px !important;
            padding: 40px !important;
          }
          .landing-feature-text {
            font-size: 20px !important;
          }
          .landing-about-content {
            flex-direction: column !important;
            gap: 20px !important;
          }
          .landing-about-image-wrapper {
            margin-left: 0 !important;
          }
          .landing-about-image {
            width: 250px !important;
            height: 250px !important;
          }
          .landing-about-text-box {
            width: 100% !important;
            height: auto !important;
            margin-right: 0 !important;
          }
          .landing-team-content {
            flex-direction: column !important;
          }
          .landing-team-image {
            width: 280px !important;
            height: 280px !important;
          }
          .landing-legal-container {
            flex-direction: column !important;
          }
        }
        @media (max-width: 768px) {
          .landing-hero-title {
            font-size: 28px !important;
            margin-bottom: 40px !important;
          }
          .landing-hero-section {
            padding: 20px 20px !important;
          }
          .landing-plaze-title {
            font-size: 38px !important;
          }
          .landing-description {
            font-size: 18px !important;
          }
          .landing-feature-image {
            width: 250px !important;
            height: 250px !important;
            border-radius: 36px !important;
          }
          .landing-feature-circle {
            width: 250px !important;
            height: 250px !important;
            padding: 30px !important;
          }
          .landing-feature-text {
            font-size: 18px !important;
          }
          .landing-register-button {
            width: 220px !important;
            height: 56px !important;
            font-size: 18px !important;
          }
          .landing-section-title {
            font-size: 38px !important;
          }
          .landing-about-text {
            font-size: 18px !important;
          }
          .landing-legal-title {
            font-size: 28px !important;
          }
          .landing-legal-text {
            font-size: 13px !important;
          }
        }
        @media (max-width: 480px) {
          .landing-hero-title {
            font-size: 22px !important;
            margin-bottom: 30px !important;
            padding: 0 10px !important;
          }
          .landing-hero-section {
            padding: 15px 15px !important;
            border-radius: 16px !important;
          }
          .landing-plaze-title {
            font-size: 32px !important;
          }
          .landing-description {
            font-size: 16px !important;
          }
          .landing-feature-image {
            width: 200px !important;
            height: 200px !important;
          }
          .landing-feature-circle {
            width: 200px !important;
            height: 200px !important;
            padding: 20px !important;
          }
          .landing-feature-text {
            font-size: 16px !important;
          }
          .landing-register-button {
            width: 200px !important;
            height: 50px !important;
            font-size: 16px !important;
          }
          .landing-section-title {
            font-size: 30px !important;
          }
          .landing-about-section {
            border-radius: 36px !important;
          }
          .landing-about-image {
            width: 200px !important;
            height: 200px !important;
          }
          .landing-about-text-box {
            border-radius: 36px !important;
            padding: 25px 20px !important;
          }
          .landing-about-text {
            font-size: 16px !important;
          }
          .landing-team-section {
            border-radius: 36px !important;
            padding: 30px 20px !important;
          }
          .landing-team-image {
            width: 220px !important;
            height: 220px !important;
          }
          .landing-legal-box {
            border-radius: 36px !important;
            padding: 30px 20px !important;
          }
          .landing-legal-title {
            font-size: 24px !important;
          }
        }
      `}</style>
      <div style={{ minHeight: '2880px', backgroundColor: '#FFFFFF' }}>
        {/* Header */}
        <LandingHeader />

      {/* Main content container */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        paddingTop: '58px'
      }}>
        {/* Hero title */}
        <h1 className="landing-hero-title" style={{
          fontSize: '46px',
          fontWeight: '700',
          color: '#4CA772',
          textAlign: 'center',
          maxWidth: '880px',
          lineHeight: '1.2',
          marginBottom: '76px'
        }}>
          Consulta precios de la canasta familiar colombiana en tiempo real
        </h1>

        {/* Hero section */}
        <div className="landing-hero-section" style={{
          width: '1008px',
          height: '688px',
          backgroundColor: 'rgba(248, 231, 176, 0.6)',
          borderRadius: '22px',
          padding: '44px 72px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Logo text */}
          <h2 className="landing-plaze-title" style={{
            fontSize: '58px',
            fontWeight: '700',
            color: '#4CA772',
            WebkitTextStroke: '0.5px #7DB76F',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
            marginBottom: '22px'
          }}>
            Plaze
          </h2>

          {/* Description */}
          <p className="landing-description" style={{
            fontSize: '26px',
            color: '#000000',
            textAlign: 'center',
            maxWidth: '880px',
            lineHeight: '1.4',
            marginBottom: '26px'
          }}>
            Accede a información actualizada sobre precios de productos de la canasta familiar en las principales plazas de mercado del país.
          </p>

          {/* Features showcase */}
          <div className="landing-features" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '58px',
            width: '100%',
            justifyContent: 'flex-start'
          }}>
            {/* Feature image */}
            <img
              className="landing-feature-image"
              src="/client_images/LandingPageImage1.png"
              alt="Plaze Products"
              style={{
                width: '400px',
                height: '400px',
                objectFit: 'cover',
                borderRadius: '72px',
                opacity: '0.85'
              }}
            />

            {/* Feature description circle */}
            <div className="landing-feature-circle" style={{
              width: '400px',
              height: '400px',
              backgroundColor: '#D2EDCC',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '58px'
            }}>
              <p className="landing-feature-text" style={{
                fontSize: '23px',
                color: '#000000',
                fontWeight: '700',
                textAlign: 'center',
                lineHeight: '1.4'
              }}>
                Nuestro sistema te permite consultar precios actuales, analizar tendencias históricas y obtener predicciones confiables para planificar mejor tus compras.
              </p>
            </div>
          </div>
        </div>

        {/* Call to action button */}
        <div style={{
          position: 'relative',
          top: '-15px',
          zIndex: 10
        }}>
          <style>
            {`
              @keyframes pulse-glow {
                0%, 100% {
                  box-shadow: 
                    0px 4px 12px rgba(0, 0, 0, 0.2),
                    0 0 15px rgba(187, 255, 160, 0.4),
                    0 0 25px rgba(187, 255, 160, 0.3),
                    0 0 35px rgba(187, 255, 160, 0.2);
                }
                50% {
                  box-shadow: 
                    0px 4px 12px rgba(0, 0, 0, 0.2),
                    0 0 20px rgba(187, 255, 160, 0.5),
                    0 0 35px rgba(187, 255, 160, 0.4),
                    0 0 50px rgba(187, 255, 160, 0.3);
                }
              }
              
              @keyframes float-bounce {
                0%, 100% {
                  transform: translateY(0px);
                }
                50% {
                  transform: translateY(-8px);
                }
              }
              
              .register-button {
                animation: pulse-glow 2s ease-in-out infinite, float-bounce 3s ease-in-out infinite;
              }
              
              .register-button:hover {
                animation: none !important;
              }
            `}
          </style>
          <button
            className="register-button landing-register-button"
            onClick={() => navigate('/register')}
            style={{
              width: '280px',
              height: '64px',
              background: 'linear-gradient(135deg, #BBFFA0 0%, #A8E88D 100%)',
              border: 'none',
              borderRadius: '72px',
              color: '#000000',
              fontSize: '20px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2), 0 0 15px rgba(187, 255, 160, 0.4), 0 0 25px rgba(187, 255, 160, 0.3)',
              transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              position: 'relative',
              overflow: 'hidden',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.15) translateY(-5px)'
              e.target.style.background = 'linear-gradient(135deg, #A8E88D 0%, #8FD67A 100%)'
              e.target.style.boxShadow = '0px 8px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(187, 255, 160, 0.7), 0 0 50px rgba(168, 232, 141, 0.5), 0 0 70px rgba(143, 214, 122, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1) translateY(0)'
              e.target.style.background = 'linear-gradient(135deg, #BBFFA0 0%, #A8E88D 100%)'
              e.target.style.boxShadow = '0px 4px 12px rgba(0, 0, 0, 0.2), 0 0 15px rgba(187, 255, 160, 0.4), 0 0 25px rgba(187, 255, 160, 0.3)'
            }}
            onMouseDown={(e) => {
              e.target.style.transform = 'scale(1.08) translateY(-3px)'
            }}
            onMouseUp={(e) => {
              e.target.style.transform = 'scale(1.15) translateY(-5px)'
            }}
          >
            Regístrate gratis
          </button>
        </div>

        {/* About section */}
        <div id="acerca-de-plaze" className="landing-about-section" style={{
          width: '1008px',
          height: '480px',
          backgroundColor: '#FEEAA9',
          borderRadius: '72px',
          marginTop: '44px',
          position: 'relative',
          padding: '21px 34px 42px 34px',
          scrollMarginTop: '120px'
        }}>
          {/* Section title */}
          <h3 className="landing-section-title" style={{
            fontSize: '51px',
            fontWeight: '700',
            color: '#000000',
            marginBottom: '22px'
          }}>
            Acerca de Plaze
          </h3>

          {/* Content layout */}
          <div className="landing-about-content" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            height: 'calc(100% - 96px)'
          }}>
            {/* About image */}
            <div className="landing-about-image-wrapper" style={{
              marginLeft: '37px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <img
                src="/client_images/LandingPageAboutPlaze.png"
                alt="About Plaze"
                className="landing-about-image"
                style={{
                  width: '328px',
                  height: '328px',
                  objectFit: 'cover',
                  borderRadius: '14px'
                }}
              />
            </div>

            {/* About text box */}
            <div className="landing-about-text-box" style={{
              width: '492px',
              height: '416px',
              backgroundColor: '#FFFFFF',
              border: '2px solid #000000',
              borderRadius: '72px',
              padding: '43px 36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              marginRight: '4px',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)'
            }}>
              <p className="landing-about-text" style={{
                fontSize: '20px',
                color: '#2B2B2B',
                lineHeight: '1.6',
                textAlign: 'justify',
                marginBottom: '22px'
              }}>
                Plaze conecta a los colombianos con <strong style={{ color: '#000000' }}>información actualizada de precios de alimentos</strong>, ayudando a las familias a <strong style={{ color: '#000000' }}>optimizar su presupuesto</strong>. Transformamos datos complejos de las principales plazas de mercado en información clara y accesible para que tomes las <strong style={{ color: '#000000' }}>mejores decisiones de compra</strong>.
              </p>
              <p className="landing-about-text" style={{
                fontSize: '20px',
                color: '#2B2B2B',
                lineHeight: '1.6',
                textAlign: 'justify',
                fontWeight: '600'
              }}>
                Nuestra meta: <span style={{ color: '#000000', fontWeight: '700' }}>Ser la herramienta de referencia para la compra inteligente de alimentos en Colombia.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Team section */}
        <div id="quienes-somos" className="landing-team-section" style={{
          width: '1008px',
          backgroundColor: '#F6D182',
          borderRadius: '72px',
          marginTop: '72px',
          padding: '43px 58px',
          display: 'flex',
          flexDirection: 'column',
          scrollMarginTop: '120px'
        }}>
          {/* Section title */}
          <h3 className="landing-section-title" style={{
            fontSize: '51px',
            fontWeight: '700',
            color: '#000000',
            marginBottom: '29px',
            textAlign: 'center'
          }}>
            Quiénes somos
          </h3>

          {/* Team content */}
          <div className="landing-team-content" style={{
            display: 'flex',
            gap: '43px',
            alignItems: 'center'
          }}>
            {/* Team description */}
            <div style={{
              flex: 1,
              paddingRight: '14px'
            }}>
              <p className="landing-about-text" style={{
                fontSize: '20px',
                color: '#000000',
                lineHeight: '1.6',
                textAlign: 'justify'
              }}>
                Somos estudiantes de Ingeniería en Ciencia de Datos que creemos en hacer la información accesible para todos los colombianos.
              </p>
              <br />
              <p className="landing-about-text" style={{
                fontSize: '20px',
                color: '#000000',
                lineHeight: '1.6',
                textAlign: 'justify'
              }}>
                Plaze es nuestra apuesta por usar la tecnología para mejorar la vida cotidiana de las familias, aplicando nuestros conocimientos en análisis de datos y desarrollo web para crear soluciones con impacto social real.
              </p>
            </div>

            {/* Team image */}
            <div style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center'
            }}>
              <img
                className="landing-team-image"
                src="/client_images/LandingPageAboutUs.png"
                alt="About Us"
                style={{
                  width: '364px',
                  height: '364px',
                  objectFit: 'cover',
                  borderRadius: '36px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Legal and info sections */}
        <div className="landing-legal-container" style={{
          width: '1008px',
          display: 'flex',
          gap: '29px',
          marginTop: '72px',
          marginBottom: '72px'
        }}>
          {/* Terms box */}
          <div id="terminos-condiciones" className="landing-legal-box" style={{
            flex: 1,
            backgroundColor: '#D49A1D',
            borderRadius: '72px',
            padding: '43px 36px',
            display: 'flex',
            flexDirection: 'column',
            scrollMarginTop: '120px'
          }}>
            <h3 className="landing-legal-title" style={{
              fontSize: '35px',
              fontWeight: '700',
              color: '#FEEAA9',
              marginBottom: '22px',
              textAlign: 'center'
            }}>
              Términos y condiciones
            </h3>
            <p className="landing-legal-text" style={{
              fontSize: '14px',
              color: '#000000',
              lineHeight: '1.6',
              textAlign: 'justify'
            }}>
              Al usar Plaze, aceptas que la información de precios se proporciona únicamente con fines informativos y puede variar respecto a los precios reales en las plazas de mercado. Nos esforzamos por mantener los datos actualizados, pero no garantizamos su precisión absoluta. Te comprometes a usar la plataforma de manera responsable, sin intentar dañar el sistema o acceder a información no autorizada. Nos reservamos el derecho de suspender cuentas que violen estas condiciones. La información personal que compartas será protegida según nuestras políticas de privacidad. Plaze no se hace responsable por decisiones de compra basadas en la información proporcionada. Al registrarte, confirmas que tienes al menos 18 años o cuentas con autorización de un adulto responsable.
            </p>
          </div>

          {/* Data source box */}
          <div id="fuente-datos" className="landing-legal-box" style={{
            flex: 1,
            backgroundColor: '#D49A1D',
            borderRadius: '72px',
            padding: '43px 36px',
            display: 'flex',
            flexDirection: 'column',
            scrollMarginTop: '120px'
          }}>
            <h3 className="landing-legal-title" style={{
              fontSize: '35px',
              fontWeight: '700',
              color: '#FEEAA9',
              marginBottom: '22px',
              textAlign: 'center'
            }}>
              Fuente de Datos
            </h3>
            <p className="landing-legal-text" style={{
              fontSize: '14px',
              color: '#000000',
              lineHeight: '1.6',
              textAlign: 'justify',
              marginBottom: '14px'
            }}>
              La información de precios presentada en Plaze proviene de datos oficiales recopilados por el Departamento Administrativo Nacional de Estadística (DANE), entidad encargada de la producción, análisis y difusión de información estadística oficial en Colombia.
            </p>
            <p className="landing-legal-text" style={{
              fontSize: '14px',
              color: '#000000',
              lineHeight: '1.6',
              textAlign: 'justify'
            }}>
              Nuestro equipo se encarga del procesamiento, análisis y visualización de estos datos para transformarlos en información accesible y útil para los usuarios, facilitando la consulta de precios y el análisis de tendencias de manera sencilla e intuitiva.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
      </div>
    </>
  )
}

export default LandingPage

