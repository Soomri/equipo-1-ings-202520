import React, { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

/**
 * ScrollToTop Component
 * Displays a floating button to scroll back to top when user scrolls down
 */
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      <style>{`
        .scroll-to-top {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 1000;
          cursor: pointer;
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateY(100px);
        }
        .scroll-to-top.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .scroll-to-top:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 8px 24px rgba(76, 167, 114, 0.4) !important;
        }
        @media (max-width: 768px) {
          .scroll-to-top {
            bottom: 1.5rem;
            right: 1.5rem;
          }
        }
      `}</style>
      <div
        className={`scroll-to-top ${isVisible ? 'visible' : ''}`}
        onClick={scrollToTop}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#4CA772',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(76, 167, 114, 0.3)'
        }}
        title="Volver arriba"
      >
        <ArrowUp className="w-6 h-6" style={{ color: 'white' }} />
      </div>
    </>
  )
}

export default ScrollToTop

