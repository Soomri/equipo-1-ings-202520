import React from 'react'
import { Search } from 'lucide-react'
import UserMenu from './UserMenu'
import { authService } from '../config/api'

const Header = () => {
  // Get current user info
  const currentUser = authService.getCurrentUser()
  
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
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Buscar un producto"
                className="border border-gray-300 rounded-l-md text-base focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent"
                style={{ width: '550px', height: '40px', paddingLeft: '20px', paddingRight: '20px' }}
              />
              <button className="px-4 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-100 flex items-center justify-center" style={{ height: '40px' }}>
                <Search className="w-5 h-5 text-gray-600" />
              </button>
            </div>
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
