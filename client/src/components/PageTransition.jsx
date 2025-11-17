import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * PageTransition Component
 * Adds smooth fade and slide animations when navigating between pages
 */
const PageTransition = ({ children }) => {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [transitionStage, setTransitionStage] = useState('fadeIn')

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fadeOut')
    }
  }, [location, displayLocation])

  return (
    <div
      className={`page-transition ${transitionStage}`}
      onAnimationEnd={() => {
        if (transitionStage === 'fadeOut') {
          setTransitionStage('fadeIn')
          setDisplayLocation(location)
        }
      }}
    >
      {children}
    </div>
  )
}

export default PageTransition

