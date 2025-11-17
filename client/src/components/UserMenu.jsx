import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, LogOut, ChevronDown } from 'lucide-react'
import { authService } from '../config/api'

const UserMenu = ({ userName = null }) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()
  
  // Get user info from localStorage
  const currentUser = authService.getCurrentUser()
  const fullName = userName || currentUser.name || currentUser.email?.split('@')[0] || "Usuario"
  // Backend returns 'admin' as the admin role
  const isAdmin = currentUser.role === 'admin'
  
  // Debug: Log user role (can be removed in production)
  console.log('UserMenu - Role:', currentUser.role, '| Is Admin:', isAdmin)
  
  // Process name: extract first name and truncate if necessary
  const getDisplayName = (name) => {
    // Extract first name (before first space)
    const firstName = name.trim().split(' ')[0]
    
    // Limit to 15 characters and add ellipsis if needed
    const maxLength = 15
    if (firstName.length > maxLength) {
      return firstName.substring(0, maxLength) + '...'
    }
    
    return firstName
  }
  
  const displayName = getDisplayName(fullName)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    console.log('Logging out...')
    setIsOpen(false)
    
    try {
      // Call logout API and clear local storage
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
      // Even if API fails, clear local storage
    }
    
    // Redirect to landing page
    navigate('/')
  }

  const handleProfile = () => {
    console.log('Going to personal information...')
    // TODO: Navigate to profile page
    setIsOpen(false)
  }

  return (
    <div className="flex items-center" style={{ gap: '12px', position: 'relative' }} ref={menuRef}>
      {/* User Greeting (static text with icon) */}
      <div className="flex items-center" style={{ gap: '8px', flexDirection: 'column', alignItems: 'flex-end' }}>
        <div className="flex items-center" style={{ gap: '8px' }}>
          <User className="w-5 h-5" style={{ color: '#333' }} />
          <span className="text-sm font-medium" style={{ color: '#333' }}>
            Hola, {displayName}
          </span>
        </div>
        {/* Admin Badge */}
        {isAdmin && (
          <div style={{
            backgroundColor: '#FF6B35',
            color: '#FFFFFF',
            fontSize: '10px',
            fontWeight: '700',
            padding: '2px 8px',
            borderRadius: '12px',
            letterSpacing: '0.5px',
            boxShadow: '0 2px 4px rgba(255, 107, 53, 0.3)',
            textTransform: 'uppercase'
          }}>
            Modo Admin
          </div>
        )}
      </div>

      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center px-3 py-3 border border-black transition-all hover:shadow-md"
        style={{
          backgroundColor: '#D2EDCC',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          position: 'relative'
        }}
      >
        <ChevronDown 
          className="w-5 h-5 transition-transform" 
          style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' 
          }} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="bg-white border border-gray-200 shadow-lg"
          style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            marginTop: '8px',
            width: '224px',
            borderRadius: '8px',
            zIndex: 9999
          }}
        >
          <div className="py-1">
            {/* Profile Option */}
            <button
              onClick={handleProfile}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center transition-colors"
              style={{ gap: '12px' }}
            >
              <User className="w-4 h-4" />
              <span>Información personal</span>
            </button>

            {/* Divider */}
            <div className="border-t border-gray-200 my-1"></div>

            {/* Logout Option */}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
              style={{ gap: '12px' }}
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMenu
