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
- **Registration Confirmation**: Success page with user feedback
- **User Login** (F-06): Secure authentication with JWT tokens
- **Password Recovery**: Email-based password reset flow
- **Password Reset**: Secure password change with token validation
- **Account Lockout Protection**: Automatic lockout after 3 failed login attempts with recovery email

### Application Features
- **Current price queries** (F-01): Search prices by product, city, and plaza
- **Price comparison**: Compare prices between different plazas
- **Intuitive interface**: Usability-focused design (NF-01)
- **Responsive**: Adaptable to different devices
- **Quick search**: With automatic suggestions

## 🛠️ Technologies

- **React 18** - Main framework
- **Vite** - Build tool
- **React Router** - Navigation with page transitions
- **Axios** - HTTP client for API communication
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
- [x] Product search component
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

### 🔄 In Progress
- [ ] Price history visualization (F-02)
- [ ] Price predictions (F-03)
- [ ] Plaza management (admin features)
- [ ] User profile management

### 📝 Pending
- [ ] Price history (F-02)
- [ ] Predictions (F-03)
- [ ] Comparison between plazas (F-04)
- [ ] Custom baskets (F-07)
- [ ] Admin panel for plaza management

---

## 🏗️ Project Structure

```
client/
├── src/
│   ├── components/              # Reusable components
│   │   ├── Header.jsx           # Application header
│   │   ├── LandingHeader.jsx    # Landing page header
│   │   ├── Footer.jsx           # Footer
│   │   ├── PageTransition.jsx   # Page transition wrapper
│   │   ├── ProductSearch.jsx    # Search form
│   │   ├── PriceResults.jsx     # Price results
│   │   ├── QuickStats.jsx       # Quick statistics
│   │   └── UserMenu.jsx         # User menu with logout
│   ├── pages/                   # Main pages
│   │   ├── LandingPage.jsx      # Landing page (root)
│   │   ├── HomePage.jsx         # Main application page
│   │   ├── LoginPage.jsx        # Login page
│   │   ├── RegisterPage.jsx     # Registration page
│   │   ├── RegisterConfirmationPage.jsx  # Registration success
│   │   ├── PasswordRecoveryPage.jsx      # Password recovery
│   │   └── ResetPasswordPage.jsx         # Password reset with token
│   ├── styles/                  # Style files
│   │   └── transitions.css      # Page transition animations
│   ├── config/                  # Configuration
│   │   └── api.js               # API services and interceptors
│   ├── App.jsx                  # Root component with routing
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── public/                      # Static files
│   └── client_images/           # Images and SVG icons
├── package.json                 # Dependencies
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
- More routes will be added for authenticated users

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
- Redirects to appropriate pages if validation fails

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
- **Loading states**: Button text changes and disabling during requests ("Enviando...", "Cambiando...")
- **Form validation**: Real-time feedback on invalid inputs
- **Success messages**: Green confirmation boxes for successful operations

---

## 🔌 API Endpoints

The client connects to the following server endpoints:

### Authentication & User Management
- `POST /registro/` - User registration
- `POST /auth/login` - User login (returns JWT token)
- `POST /auth/logout` - User logout (invalidates token)
- `POST /password/recover/{email}` - Request password recovery email
- `POST /password/reset/{token}` - Reset password with token

### Price Queries (F-01)
- `GET /prices/current` - Current prices
- `GET /prices/history` - Price history
- `GET /prices/predictions` - Predictions

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
- **`plazaService`**: Market plaza information
- **`statsService`**: Statistics and analytics
- **`authService`**: Authentication and user management
  - `register(userData)` - User registration
  - `login(email, password)` - User login
  - `logout()` - User logout
  - `recoverPassword(email)` - Request password recovery
  - `resetPassword(token, newPassword)` - Reset password
  - `isAuthenticated()` - Check authentication status
  - `getCurrentUser()` - Get current user info from localStorage

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

### Responsive Design
- **Mobile First**: Mobile-optimized design
- **Flexible layouts**: Adapts to different screen sizes
- **Centered forms**: 600px width forms with proper spacing
- **Readable text**: 18px base font size for inputs

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

## 🧪 Testing the Application

### Test Registration Flow
1. Go to `http://localhost:3000/register`
2. Fill form with valid data:
   - Name: Any name
   - Email: Valid email format
   - Password: Min 8 chars, 1 uppercase, 1 number, 1 special char
3. Submit and verify redirect to confirmation page

### Test Login Flow
1. Go to `http://localhost:3000/login`
2. Enter registered credentials
3. Verify redirect to `/home` with user menu

### Test Password Recovery
1. Go to `http://localhost:3000/password-recovery`
2. Enter registered email
3. Check email inbox for recovery link
4. Click link to land on reset page
5. Enter new password and confirm
6. Verify success message and ability to login

### Test Account Lockout
1. Go to `http://localhost:3000/login`
2. Enter wrong password 3 times
3. Verify account lockout message
4. Check email for recovery link
5. Use link to reset password

---

## 🤝 Contributing

1. Create a branch for the new feature
2. Implement changes
3. Test functionality thoroughly
4. Ensure no linter errors
5. Create a Pull Request

---

## 📞 Support

For issues or questions:
- Check the browser console for errors
- Verify that the backend server is running
- Consult the API documentation at `http://localhost:8000/docs`
- Check Network tab in DevTools for failed requests

---

## 📄 License

Academic project - Universidad Pontificia Bolivariana

