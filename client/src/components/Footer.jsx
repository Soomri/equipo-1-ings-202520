import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Footer = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const isLandingPage = location.pathname === '/'

  const handleLinkClick = (e, sectionId) => {
    e.preventDefault()
    
    if (isLandingPage) {
      // If we're on the landing page, scroll to the section
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else {
      // If we're on another page, navigate to landing page with hash
      navigate(`/#${sectionId}`)
      // After navigation, scroll to the section
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }

  return (
    <footer className="py-12" style={{ backgroundColor: 'rgba(76, 167, 114, 0.7)' }}>
      <div className="container">
        <div className="flex justify-center flex-wrap gap-12">
          {/* Footer links */}
          <a 
            href="#acerca-de-plaze" 
            onClick={(e) => handleLinkClick(e, 'acerca-de-plaze')}
            className="text-white text-lg font-medium hover:text-gray-200 transition-colors px-6 py-3 border-2 border-white border-opacity-50 rounded-xl hover:bg-white hover:bg-opacity-20 shadow-lg"
            style={{ minWidth: '200px', textAlign: 'center', flex: '0 0 auto', cursor: 'pointer' }}
          >
            Sobre el proyecto
          </a>
          <a 
            href="#quienes-somos" 
            onClick={(e) => handleLinkClick(e, 'quienes-somos')}
            className="text-white text-lg font-medium hover:text-gray-200 transition-colors px-6 py-3 border-2 border-white border-opacity-50 rounded-xl hover:bg-white hover:bg-opacity-20 shadow-lg"
            style={{ minWidth: '200px', textAlign: 'center', flex: '0 0 auto', cursor: 'pointer' }}
          >
            Quiénes somos
          </a>
          <a 
            href="#terminos-condiciones" 
            onClick={(e) => handleLinkClick(e, 'terminos-condiciones')}
            className="text-white text-lg font-medium hover:text-gray-200 transition-colors px-6 py-3 border-2 border-white border-opacity-50 rounded-xl hover:bg-white hover:bg-opacity-20 shadow-lg"
            style={{ minWidth: '200px', textAlign: 'center', flex: '0 0 auto', cursor: 'pointer' }}
          >
            Términos y condiciones
          </a>
          <a 
            href="#fuente-datos" 
            onClick={(e) => handleLinkClick(e, 'fuente-datos')}
            className="text-white text-lg font-medium hover:text-gray-200 transition-colors px-6 py-3 border-2 border-white border-opacity-50 rounded-xl hover:bg-white hover:bg-opacity-20 shadow-lg"
            style={{ minWidth: '200px', textAlign: 'center', flex: '0 0 auto', cursor: 'pointer' }}
          >
            Información de los datos
          </a>
        </div>

        <div className="border-t border-white border-opacity-30 mt-8 pt-8 text-center">
          <p className="text-white text-sm">
            © 2025 PLAZE. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
