# PLAZE - Frontend Client


Web application for querying product prices in Medellín's market plazas.

## 🚀 Features

### Landing Page
- **Welcome screen**: First point of contact for new visitors
- **Product showcase**: Visual presentation of platform capabilities
- **Interactive CTA**: Animated "Register for Free" button with hover effects
- **About sections**: Information about the platform, team, and data sources
- **Terms and conditions**: Legal information and data transparency

### Authentication & User Management
- **User Registration** (F-05): Complete registration flow with backend validation
  - Includes link to login page for existing users
  - Password strength requirements clearly displayed
- **Registration Confirmation**: Success page with user feedback
- **User Login** (F-06): Secure authentication with JWT tokens
  - Includes link to registration page for new users
  - Direct link to password recovery
- **Password Recovery**: Email-based password reset flow
- **Password Reset**: Secure password change with token validation
- **Account Lockout Protection**: Automatic lockout after 3 failed login attempts with recovery email
- **User Display Optimization**: Smart name truncation (first name only, max 15 chars)

### Application Features
- **Current price queries** (F-01): Search prices by product, city, and plaza
- **Price history visualization** (F-02): Interactive charts showing historical price trends
- **Advanced filtering**: Filter searches by specific market plazas (lazy loading)
- **Price comparison**: Compare prices between different plazas
- **Statistical analysis**: Key metrics, trends, and price variations over time
- **Intuitive interface**: Usability-focused design (NF-01)
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **Adaptive Layouts**: All pages dynamically adjust to screen size
- **Quick search**: With automatic suggestions
- **Performance Optimized**: Lazy loading of filters to reduce unnecessary API calls

### Administrator Features
- **Role-based Access Control**: Admin users have special privileges
- **Admin Badge**: Visual indicator "MODO ADMIN" in header for administrators
- **Admin Panel Access**: Dedicated administration page for managing plazas
- **Protected Routes**: Admin-only pages with automatic redirection
- **Admin Button**: Special "Administrar Plazas" button on HomePage (admin-only)

## 🛠️ Technologies

- **React 18** - Main framework
- **Vite** - Build tool
- **React Router** - Navigation with page transitions
- **Axios** - HTTP client for API communication
- **Recharts** - Interactive data visualization and charts
- **Lucide React** - Icons
- **CSS3** - Custom styles with animations

---

## 📋 Prerequisites

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **Backend server** running on `http://localhost:8000`

---

## 🚀 Installation and Execution

### 1. Install Dependencies
```bash
cd client
npm install
```

**Note**: The project uses **Recharts** for data visualization. It will be automatically installed with `npm install`. If you need to install it separately:
```bash
npm install recharts
```

### 2. Configure Environment Variables
Create a `.env` file in the `client` folder (if it doesn't exist):
```env
VITE_API_URL=http://127.0.0.1:8000
```
**Note**: Do NOT add `/api` at the end. The routes are configured without this prefix.

### 3. Run in Development Mode
```bash
npm run dev
```

### 4. Open in Browser
- URL: http://localhost:3000
- The development server runs on port 3000

---

## 🔧 Available Scripts

- `npm run dev` - Development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run code linter

---

## 📱 Implemented Features

### ✅ Completed
- [x] Project base structure
- [x] **Landing page** (initial page for new visitors)
- [x] **User registration** with backend validation (F-05)
- [x] **Registration confirmation page** with success feedback
- [x] **User login** with JWT authentication (F-06)
- [x] **Password recovery flow** with email integration
- [x] **Password reset page** with token validation
- [x] **Account lockout protection** (3 failed attempts)
- [x] **Product search component with plaza filtering**
- [x] **Price history visualization** (F-02) with interactive charts
- [x] **Product detail page** with comprehensive analysis
- [x] **Statistical analysis** (trends, variations, key metrics)
- [x] Price results visualization
- [x] Responsive design
- [x] **Full API integration** with backend
- [x] Quick statistics
- [x] Error handling with user-friendly messages
- [x] Interactive UI animations
- [x] **Page transitions** (smooth fade and slide animations)
- [x] User logout flow (returns to landing page)
- [x] Form validation (client and server-side)
- [x] Loading states for async operations
- [x] **UX Enhancements** (October 2024):
  - [x] Visible labels on all form inputs
  - [x] Improved text contrast across all inputs
  - [x] Call-to-action heading on HomePage search
  - [x] Redesigned filter system with visual indicators
  - [x] Active filter badges and chips
  - [x] Functional header search bar
  - [x] Smart footer with section navigation
  - [x] Footer removed from HomePage and ProductDetailPage
- [x] **Navigation & Usability** (November 2024):
  - [x] Cross-navigation links between login and register forms
  - [x] Smart name truncation in header (first name only, 15 char limit)
  - [x] Adaptive form containers (grow with content)
- [x] **Responsive Design System** (November 2024):
  - [x] All pages fully responsive (mobile, tablet, desktop)
  - [x] Adaptive Header with balanced layout
  - [x] Responsive search components
  - [x] Mobile-optimized forms and cards
  - [x] Media queries for all breakpoints (480px, 768px, 992px, 1200px, 1400px)
- [x] **Administrator System** (November 2024):
  - [x] Role-based access control
  - [x] Admin badge in UserMenu
  - [x] Admin panel navigation button
  - [x] AdminPlazasPage with route protection
  - [x] Admin-only features visibility control
- [x] **Performance Optimizations** (November 2024):
  - [x] Lazy loading of plaza filters (on-demand)
  - [x] Optimized API calls (no unnecessary requests)

### 🔄 In Progress
- [ ] Price predictions (F-03)
- [ ] Plaza CRUD operations (admin features)
- [ ] User profile management
- [ ] Admin dashboard statistics

---

## 🏗️ Project Structure

```
client/
├── src/
│   ├── components/              # Reusable components
│   │   ├── Header.jsx           # Application header with functional search
│   │   ├── LandingHeader.jsx    # Landing page header
│   │   ├── Footer.jsx           # Smart footer with section navigation
│   │   ├── PageTransition.jsx   # Page transition wrapper
│   │   ├── ProductSearch.jsx    # Advanced search with visual filter indicators
│   │   ├── PriceResults.jsx     # Price results
│   │   ├── PriceHistoryChart.jsx # Interactive price history chart (recharts)
│   │   ├── PriceStats.jsx       # Price statistics cards
│   │   ├── TrendPeriods.jsx     # Price trend analysis display
│   │   ├── QuickStats.jsx       # Quick statistics
│   │   └── UserMenu.jsx         # User menu with logout & admin badge
│   ├── pages/                   # Main pages
│   │   ├── LandingPage.jsx      # Landing page with section IDs (fully responsive)
│   │   ├── HomePage.jsx         # Main page with CTA and enhanced search (responsive)
│   │   ├── ProductDetailPage.jsx # Product detail with price history (F-02, responsive)
│   │   ├── LoginPage.jsx        # Login page (fully responsive & adaptive)
│   │   ├── RegisterPage.jsx     # Registration page (fully responsive & adaptive)
│   │   ├── RegisterConfirmationPage.jsx  # Registration success (responsive)
│   │   ├── PasswordRecoveryPage.jsx      # Password recovery (responsive)
│   │   ├── ResetPasswordPage.jsx         # Password reset (responsive)
│   │   └── AdminPlazasPage.jsx  # Admin panel for plaza management (admin-only)
│   ├── styles/                  # Style files
│   │   ├── transitions.css      # Page transition animations
│   │   └── product-detail.css   # Product detail page styles
│   ├── config/                  # Configuration
│   │   └── api.js               # API services and interceptors
│   ├── App.jsx                  # Root component with routing
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── public/                      # Static files
│   └── client_images/           # Images and SVG icons
├── package.json                 # Dependencies (includes recharts)
├── vite.config.js               # Vite configuration
└── index.html                   # Main HTML
```

---

## 🗺️ Routes

The application uses the following route structure:

### Public Routes
- **`/`** - Landing page (default entry point for new visitors)
- **`/login`** - User login page
- **`/register`** - User registration page
- **`/register-confirmation`** - Registration confirmation page (protected)
- **`/password-recovery`** - Password recovery request page
- **`/reset-password`** - Password reset page with token validation

### Protected Routes (require authentication)
- **`/home`** - Main application page with product search and price queries
- **`/product/:productName`** - Product detail page with price history and analysis (F-02)
  - Supports query parameter: `?plaza=PlazaName` for filtering by specific plaza

### Admin Routes (require admin role)
- **`/admin/plazas`** - Plaza management panel (admin-only)
  - Automatically redirects non-admin users to `/home`
  - Displays admin badge and management interface

### Route Behavior
- First-time visitors land on **`/`** (Landing Page)
- Landing page includes a call-to-action to register/login
- After authentication, users are redirected to **`/home`**
- Landing page, login, registration, and recovery pages have their own custom layout
- Application pages (`/home`) use the standard header with user menu
- Registration confirmation page is only accessible after successful registration
- Reset password page requires a valid token from recovery email

### Route Protection
- `/register-confirmation` validates registration state before rendering
- `/reset-password` extracts and validates token from URL query parameters
- `/admin/plazas` checks admin role and redirects non-admin users
- Redirects to appropriate pages if validation fails
- Automatic logout redirect on token expiration (401 errors)

---

## 🔐 Authentication Flow

### Registration Flow
1. User visits `/register`
2. Fills out form with name, email, and password
3. Client validates password requirements (8 chars, uppercase, number, special char)
4. Sends registration request to backend
5. On success, navigates to `/register-confirmation` with user data
6. User can proceed to login

### Login Flow
1. User visits `/login`
2. Enters email and password
3. Backend validates credentials
4. On success, receives JWT token
5. Token stored in localStorage
6. User redirected to `/home`
7. Token automatically included in subsequent API requests

### Password Recovery Flow
1. **Manual Recovery**: User requests password reset from `/password-recovery`
2. **Automatic Lockout**: After 3 failed login attempts, account locked for 15 minutes
3. Backend sends email with reset link to frontend
4. Email contains link: `http://localhost:3000/reset-password?token={uuid}`
5. User clicks link, lands on `/reset-password` page
6. Frontend extracts token from URL
7. User enters new password
8. Frontend sends token + new password to backend
9. Backend validates token (not expired, not used, valid user)
10. Password updated successfully
11. User redirected to login

### Security Features
- **JWT Tokens**: Secure authentication with expiration
- **Password Hashing**: Argon2 hashing on backend
- **Token Validation**: One-time use tokens with 1-hour expiration
- **Account Lockout**: Protection against brute force attacks
- **Email Verification**: Recovery links sent to registered email
- **Client-side Validation**: Immediate feedback on form errors
- **Server-side Validation**: Final validation on backend
- **Role-based Access**: Admin features protected by role verification
- **Automatic Redirection**: Non-admin users redirected from protected routes

---

## 👑 Administrator System

### Overview
Plaze includes a role-based access control system with two user types:
- **`usuario`**: Regular user with standard features
- **`admin`**: Administrator with additional management capabilities

### Admin Features

#### 1. Visual Indicators
**Admin Badge in Header:**
- Orange badge displaying "MODO ADMIN" appears below the user's name
- Visible only to users with admin role
- Located in the UserMenu component in the header

**Admin Button on HomePage:**
- Orange "Administrar Plazas" button with Settings icon
- Appears below the search component
- Only visible to admin users
- Navigates to `/admin/plazas`

#### 2. Admin Panel (`/admin/plazas`)
- **Access**: Restricted to admin users only
- **Protection**: Automatic redirect to `/home` for non-admin users
- **Features**: Plaza management interface (expandable)
- **Design**: Fully responsive with admin branding

### How It Works

#### Role Detection
The frontend checks the user's role from localStorage:
```javascript
const currentUser = authService.getCurrentUser()
const isAdmin = currentUser.role === 'admin'
```

#### Role Assignment
- User role is assigned by the backend during login
- Stored in `localStorage` with key `user_role`
- Value: `"admin"` for administrators, `"usuario"` for regular users

#### Conditional Rendering
Admin-exclusive elements use conditional rendering:
```javascript
{isAdmin && (
  <div>Admin-only content</div>
)}
```

### User Experience

#### Regular User:
- ✅ Full access to all standard features
- ✅ Can search products, view prices, analyze history
- ❌ Does NOT see admin badge
- ❌ Does NOT see "Administrar Plazas" button
- ❌ Cannot access `/admin/plazas` (redirected to home)

#### Administrator:
- ✅ All regular user features PLUS:
- ✅ "MODO ADMIN" badge visible in header
- ✅ "Administrar Plazas" button on HomePage
- ✅ Access to `/admin/plazas` panel
- ✅ Can navigate normally through all pages
- ✅ Additional management capabilities (expandable)

### Debugging Admin Access

If you can't access admin features:

1. **Check browser console** (F12):
   - Look for: `HomePage - Role: admin | Is Admin: true`
   - If you see `Role: usuario` or `Role: null`, contact backend team

2. **Verify localStorage** (DevTools → Application → Local Storage):
   - Key: `user_role`
   - Expected value: `"admin"`

3. **Verify authentication**:
   - Ensure you're logged in
   - Token should be present in localStorage (`access_token`)

4. **Logout and login again** if role was recently changed

---

## 🎬 UI/UX Enhancements

### Page Transitions
The application features smooth CSS-based page transitions for a modern user experience:

- **Fade and Slide animations**: Pages smoothly fade out and slide up when leaving, then fade in and slide up when entering
- **Duration**: 0.3 seconds for quick but visible transitions
- **Timing function**: Cubic-bezier easing for natural motion
- **Landing page special effect**: Subtle scale animation on first load
- **No dependencies**: Pure CSS implementation (no external libraries required)
- **Performance**: Hardware-accelerated transforms for smooth 60fps animations

### Interactive Elements
- **Animated CTA buttons**: Floating and glow effects on primary call-to-action
- **Hover effects**: Smooth transitions on buttons, cards, and interactive elements
- **Smooth scrolling**: Native smooth scroll behavior enabled
- **Card animations**: Subtle lift effect on hover
- **Loading states**: Disabled inputs and buttons during async operations
- **Error feedback**: Clear error messages with color-coded styling

### User Flow
- **Logout behavior**: Clicking "Cerrar sesión" clears tokens and returns to landing page
- **Navigation**: Seamless transitions between all routes
- **Cross-page links**: Login and register forms include links to navigate between them
- **Name display**: User's first name shown in header, truncated to 15 chars if needed
- **Loading states**: Button text changes and disabling during requests ("Enviando...", "Cambiando...")
- **Form validation**: Real-time feedback on invalid inputs
- **Success messages**: Green confirmation boxes for successful operations
- **Admin workflow**: Admin users see additional navigation options and management tools

---

## 🔌 API Endpoints

The client connects to the following server endpoints:

### Authentication & User Management
- `POST /registro/` - User registration
- `POST /auth/login` - User login (returns JWT token)
- `POST /auth/logout` - User logout (invalidates token)
- `POST /password/recover/{email}` - Request password recovery email
- `POST /password/reset/{token}` - Reset password with token

### Price Queries
- `GET /prices/latest/?product_name={product}&market_name={market}` - Get latest price for specific product and market (F-01)
- `GET /prices/options/` - Get all available products and plazas
- `GET /price-history/{product_name}?months={months}` - Get price history with statistical analysis (F-02)
- `GET /prices/predictions` - Predictions (F-03)

### Products
- `GET /products/search` - Product search
- `GET /products/suggestions` - Search suggestions

### Market Plazas
- `GET /plazas` - List of plazas
- `GET /plazas/{id}` - Plaza details

### Statistics
- `GET /stats/quick` - Quick statistics
- `GET /stats/variations` - Price variations

---

## 🔧 API Service Configuration

The `api.js` file includes:

### Axios Instance Configuration
- **Base URL**: Configurable via `VITE_API_URL` environment variable
- **Timeout**: 10 seconds
- **Headers**: Automatic `Content-Type: application/json`

### Request Interceptor
- Automatically adds JWT token to `Authorization` header
- Reads token from `localStorage`

### Response Interceptor
- Handles 401 Unauthorized errors globally
- Automatically clears tokens and redirects to login on auth failure

### Service Modules
- **`productService`**: Product and price queries
  - `getPriceHistory(productName, months)` - Get historical price data with trends (F-02)
  - `getLatestPrice(productName, marketName)` - Get current price for specific market
  - `getOptions()` - Get all available products and plazas
  - `getCurrentPrices(product, city, plaza)` - Query current prices
  - `getPricePredictions(product, city, plaza, months)` - Get price predictions
  - `searchProducts(query)` - Search products by name
  - `getSearchSuggestions(query)` - Get search autocomplete suggestions
- **`plazaService`**: Market plaza information
  - `getPlazas(city)` - Get list of plazas by city
  - `getPlazaDetails(plazaId)` - Get detailed plaza information
- **`statsService`**: Statistics and analytics
  - `getQuickStats()` - Get quick statistics
  - `getPriceVariations(period)` - Get price variations by period
- **`authService`**: Authentication and user management
  - `register(userData)` - User registration
  - `login(email, password)` - User login (stores role in localStorage)
  - `logout()` - User logout (clears all user data including role)
  - `recoverPassword(email)` - Request password recovery
  - `resetPassword(token, newPassword)` - Reset password
  - `isAuthenticated()` - Check authentication status
  - `getCurrentUser()` - Get current user info from localStorage
    - Returns: `{ email, name, role, isAuthenticated }`
    - Role can be: `"admin"` or `"usuario"`

---

## 📊 Price History Visualization (F-02)

The product detail page provides comprehensive price analysis and visualization:

### Features
- **Interactive Line Chart**: Historical price visualization using Recharts library
- **Statistical Analysis**: 
  - Current price
  - Price variation percentage
  - Average, maximum, and minimum prices
  - General trend (Increase/Decrease/Stability)
- **Trend Periods**: Automatic detection of price trend periods with dates and variations
- **Price Filtering**: Filter results by specific market plaza
- **Time Period Selection**: View data for 3, 6, or 12 months
- **Current Prices by Plaza**: Compare current prices across different market plazas

### Components

#### PriceHistoryChart
- Line chart with date axis and price axis
- Reference line showing current price
- Interactive tooltip with formatted prices
- Responsive design that adapts to screen size

#### PriceStats
- Four statistics cards displaying:
  - Current price (green)
  - Percentage variation (color-coded by trend)
  - Average price (gray)
  - General trend with icon (up/down/stable)

#### TrendPeriods
- Visual list of detected trend periods
- Shows date ranges, price changes, and percentage variations
- Color-coded by trend type (green for decrease, orange for increase)

### User Flow
1. User searches for a product from home page
2. Optionally selects a specific plaza using the filter dropdown
3. Clicks "Buscar precios"
4. Navigates to `/product/{productName}?plaza={plazaName}`
5. Views comprehensive analysis:
   - Statistical cards at the top
   - Interactive price history chart
   - Trend periods analysis
   - Current prices by plaza (filtered if plaza was selected)
6. Can change time period (3/6/12 months) to update the view
7. Click "Volver" to return to home page

### Technical Details
- **Chart Library**: Recharts (React-based charting library)
- **Data Source**: `/price-history/{product_name}` endpoint
- **Update Frequency**: Real-time when changing time period or product
- **Error Handling**: User-friendly messages for missing data or connection issues
- **Loading States**: Spinner during data fetch
- **Responsive**: Mobile-friendly layout with collapsible sections

---

## 🎨 Design

The design follows Figma specifications and complies with usability requirements (NF-01):

- **Main colors**: 
  - Primary Green: `#4CA772`
  - Light Green: `#D2EDCC`
  - Black: `#000000`
  - Error Red: `#D32F2F`
  - Error Background: `#FFEBEE`
- **Typography**: System fonts (Arial, sans-serif)
- **Spacing**: Consistent padding and margins
- **Components**: Unified cards, buttons, and forms across all pages

### Responsive & Adaptive Design (November 2024)
All pages are now fully responsive with adaptive layouts:

#### Breakpoints
- **480px**: Mobile devices (small phones)
- **768px**: Tablets (portrait)
- **992px**: Tablets (landscape) and small laptops
- **1200px**: Laptops
- **1400px**: Large laptops and desktops

#### Key Features
- **Adaptive Containers**: Use `minHeight` instead of fixed `height`, grow with content
- **Flexible Grids**: Grid layouts collapse to single column on mobile
- **Responsive Images**: Scale proportionally on all devices
- **Adaptive Typography**: Font sizes scale based on screen size
- **Mobile-optimized Forms**: Full-width inputs on small screens
- **Balanced Header**: Logo, search bar, and user menu proportionally distributed
- **Smart Truncation**: User names intelligently shortened to fit space

#### Components with Responsive Design
- ✅ **Header**: Fully responsive with adaptive search bar
- ✅ **UserMenu**: Name truncation and admin badge display
- ✅ **ProductSearch**: Full-width input on mobile, lazy-loaded filters
- ✅ **All Pages**: LoginPage, RegisterPage, HomePage, LandingPage, ProductDetailPage, etc.
- ✅ **Forms**: Adaptive width and padding based on screen size
- ✅ **Buttons**: Responsive sizing and positioning

---

## ⚡ Performance Optimizations

### Lazy Loading
**Plaza Filters (ProductSearch component):**
- Plazas are loaded only when user clicks "Filtrar por plazas"
- Prevents unnecessary `GET /prices/options/` requests on HomePage load
- Improves initial page load time
- Reduces server load

### Smart Data Fetching
- Components fetch data only when needed
- No duplicate requests for the same data
- Proper error handling to prevent failed request loops

### Responsive Images
- Images use proper sizing for each breakpoint
- Optimized loading with `objectFit` for better rendering

### Code Splitting
- React Router handles automatic code splitting by route
- Each page loads independently
- Reduces initial bundle size

---

## 🔧 Server Configuration

For the client to work correctly, the server must be running on:
- **URL**: http://localhost:8000
- **CORS**: Configured to allow requests from http://localhost:3000
- **Email**: Configured SMTP for password recovery emails
- **Environment Variables**: 
  - `FRONTEND_URL=http://localhost:3000` (for password reset links)
  - `EMAIL_USER` and `EMAIL_PASS` (for sending emails)

---

## 🐛 Troubleshooting

### Server Connection Error
If the server is unavailable:
- Check that backend is running on port 8000
- Verify CORS configuration allows `http://localhost:3000`
- Check browser console for detailed error messages
- Ensure `VITE_API_URL` is correctly set in `.env`

### Authentication Issues
- Clear localStorage if experiencing token-related issues
- Check that JWT token is being sent in headers (DevTools → Network)
- Verify token hasn't expired
- Ensure backend authentication routes are working

### Admin Access Issues
- Verify your user has `role: "admin"` in localStorage
- Check console logs: Should show `Is Admin: true`
- Contact backend team to update your user role in the database
- Logout and login again after role changes

### Password Recovery Not Working
- Verify backend SMTP configuration is correct
- Check spam folder for recovery emails
- Ensure `FRONTEND_URL` is set to `http://localhost:3000` in backend
- Confirm email addresses are registered in the database

### Port in Use
If port 3000 is occupied:
```bash
# Vite will automatically use the next available port
# Or you can specify a different port:
npm run dev -- --port 3001
```

### CORS Issues
Make sure the backend server has CORS configured to allow requests from `http://localhost:3000`.

---

## 📅 Recent Updates - November 2024

### Authentication UX Improvements
**Cross-navigation between forms:**
- Login page now includes "¿Aún no tienes una cuenta? Regístrate ahora" link
- Register page now includes "¿Ya tienes una cuenta? Inicia sesión" link
- Improves user flow between authentication pages

**User display optimization:**
- Names in header truncated to first name only
- Maximum 15 characters with "..." if needed
- Example: "Juan Pérez" → "Juan", "Paragutirimicuaro" → "Paragutirimi..."

### Complete Responsive Design Implementation
**All pages made fully responsive:**
- ✅ LoginPage & RegisterPage - Adaptive forms with flexible containers
- ✅ PasswordRecoveryPage & ResetPasswordPage - Responsive success messages
- ✅ RegisterConfirmationPage - Adaptive confirmation boxes
- ✅ LandingPage - Complex multi-section layout fully responsive
- ✅ HomePage - Adaptive hero section and search
- ✅ ProductDetailPage - Responsive charts and statistics

**Header Component Enhancement:**
- Fully responsive header with balanced layout
- Logo, search bar, and user menu proportionally distributed
- Adaptive search bar sizes:
  - Desktop: 550px
  - Laptop: 450px → 350px
  - Tablet: 280px → 200px
  - Mobile: 140px
- Grid-based layout for perfect centering

**ProductSearch Component:**
- Main search input fully responsive
- 100% width on mobile devices
- Adaptive button sizes
- Centered filter buttons on small screens

### Administrator System
**New role-based features:**
- Admin role detection from localStorage (`user_role`)
- "MODO ADMIN" badge in UserMenu header
- "Administrar Plazas" button on HomePage (admin-only)
- New AdminPlazasPage (`/admin/plazas`) with route protection
- Conditional rendering for admin-exclusive features
- Console logging for debugging admin access

**Security:**
- Automatic redirection for non-admin users
- Role verification on protected routes
- Admin features hidden from regular users

### Performance Optimizations
**Lazy Loading Implementation:**
- Plaza filters now load only when needed (on filter button click)
- Eliminates unnecessary `GET /prices/options/` request on HomePage load
- Reduces initial page load time
- Improves server performance

**API Call Optimization:**
- Components fetch data only when required
- No duplicate or redundant requests
- Proper dependency management in useEffect hooks

### Technical Improvements
- All pages use consistent responsive patterns
- Media queries at standard breakpoints (480px, 768px, 992px, 1200px, 1400px)
- CSS Grid and Flexbox for modern layouts
- Inline styles with CSS-in-JS patterns for dynamic responsive classes
- Better separation of concerns in components

---

## 📞 Support

For issues or questions:
- Check the browser console for errors
- Verify that the backend server is running
- Consult the API documentation at `http://localhost:8000/docs`
- Check Network tab in DevTools for failed requests
- For admin issues, verify `user_role` in localStorage