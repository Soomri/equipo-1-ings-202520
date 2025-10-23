import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import UserMenu from './UserMenu'
import { authService } from '../config/api'

const Header = () => {
  // Get current user info
  const currentUser = authService.getCurrentUser()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to product detail page without plaza filter (searches all plazas)
      navigate(`/product/${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('') // Clear search after submit
    }
  }

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e)
    }
  }
  
  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: 'rgba(76, 167, 114, 0.7)', position: 'relative', overflow: 'visible' }}>
      <div className="container" style={{ overflow: 'visible' }}>
        <div className="flex items-center justify-between" style={{ height: '100px', overflow: 'visible' }}>
          {/* Logo - Extends beyond the header */}
          <div className="flex items-center" style={{ position: 'relative', overflow: 'visible' }}>
            <img 
              src="/client_images/Plaze-Logo.png" 
              alt="Plaze Logo" 
              style={{ 
                height: '220px', 
                width: 'auto',
                objectFit: 'contain',
                position: 'relative',
                top: '40px',
                zIndex: 100,
                cursor: 'pointer'
              }}
              onClick={() => window.location.href = '/home'}
            />
          </div>

          {/* Search Bar - Centered */}
          <div className="flex-1 max-w-md mx-0">
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Buscar un producto"
                className="border border-gray-300 rounded-l-md text-base focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent"
                style={{ 
                  width: '550px', 
                  height: '40px', 
                  paddingLeft: '20px', 
                  paddingRight: '20px',
                  color: '#1a1a1a'
                }}
              />
              <button 
                type="submit"
                disabled={!searchQuery.trim()}
                className="px-4 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-100 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                style={{ height: '40px' }}
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>
            </form>
          </div>

          {/* User Menu */}
          <div className="flex items-center">
            <UserMenu userName={currentUser.name} />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
