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
    <>
      <style>{`
        .header-container {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
        }
        .header-logo-wrapper {
          flex: 0 0 auto !important;
        }
        .header-search-wrapper {
          flex: 1 1 auto !important;
          display: flex !important;
          justify-content: center !important;
          max-width: 600px !important;
          margin: 0 20px !important;
        }
        .header-user-menu {
          flex: 0 0 auto !important;
        }
        @media (max-width: 1400px) {
          .header-search-input {
            width: 450px !important;
          }
          .header-search-wrapper {
            max-width: 500px !important;
          }
        }
        @media (max-width: 1200px) {
          .header-search-input {
            width: 350px !important;
          }
          .header-search-wrapper {
            max-width: 400px !important;
          }
        }
        @media (max-width: 992px) {
          .header-logo {
            height: 160px !important;
            top: 30px !important;
          }
          .header-container {
            height: 80px !important;
          }
          .header-search-input {
            width: 280px !important;
          }
          .header-search-wrapper {
            max-width: 320px !important;
          }
        }
        @media (max-width: 768px) {
          .header-main {
            min-height: 100px !important;
          }
          .header-logo {
            height: 100px !important;
            top: 10px !important;
          }
          .header-container {
            height: 100px !important;
            padding: 10px !important;
            gap: 8px !important;
          }
          .header-search-wrapper {
            max-width: 240px !important;
            margin: 0 10px !important;
          }
          .header-search-input {
            width: 200px !important;
          }
        }
        @media (max-width: 480px) {
          .header-main {
            min-height: 90px !important;
          }
          .header-logo {
            height: 80px !important;
            top: 10px !important;
          }
          .header-container {
            height: 90px !important;
            padding: 8px !important;
            gap: 6px !important;
          }
          .header-search-wrapper {
            max-width: 160px !important;
            margin: 0 6px !important;
          }
          .header-search-input {
            width: 140px !important;
            padding-left: 8px !important;
            padding-right: 8px !important;
            font-size: 13px !important;
            height: 36px !important;
          }
          .header-search-button {
            height: 36px !important;
            padding-left: 10px !important;
            padding-right: 10px !important;
          }
        }
      `}</style>
      <header className="sticky top-0 z-50 header-main" style={{ backgroundColor: 'rgba(76, 167, 114, 0.7)', position: 'relative', overflow: 'visible' }}>
        <div className="container" style={{ overflow: 'visible' }}>
          <div className="header-container" style={{ height: '100px', overflow: 'visible', position: 'relative' }}>
            {/* Logo - Left aligned */}
            <div className="header-logo-wrapper" style={{ position: 'relative', overflow: 'visible', display: 'flex', alignItems: 'center' }}>
              <img 
                className="header-logo"
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
            <div className="header-search-wrapper">
              <form onSubmit={handleSearch} className="flex items-center header-search-form" style={{ width: '100%' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Buscar un producto"
                  className="border border-gray-300 rounded-l-md text-base focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent header-search-input"
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
                  className="px-4 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-100 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed header-search-button" 
                  style={{ height: '40px' }}
                >
                  <Search className="w-5 h-5 text-gray-600" />
                </button>
              </form>
            </div>

            {/* User Menu - Right aligned */}
            <div className="header-user-menu" style={{ display: 'flex', alignItems: 'center' }}>
              <UserMenu userName={currentUser.name} />
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
