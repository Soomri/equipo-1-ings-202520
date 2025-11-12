# 🎨 Frontend Testing

This section documents the **Smoke Test** for the frontend module.
It identifies the most critical UI flows that must be validated after each deployment to ensure the system remains functional and stable.

---

## 🚀 Smoke Test — Critical Flows

| ID       | Flow Tested                             | Why It's Critical                                                                                                                               | Test Cases                                           | Implemented   |
| -------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ------------- |
| **F-01** | **Price Consultation**                  | Core functionality allowing users to view current product prices. Essential for the main value proposition of the application.                  | *Not implemented in this MVP*                        | ❌             |
| **F-06** | **User Login - Incomplete Email Validation** | Prevents users from attempting authentication with invalid emails. Client-side validation improves UX before calling the API.              | Email without complete domain (`arigato@`)           | ✅ Implemented |
| **F-06** | **User Login - Invalid Email Validation**    | Ensures only properly formatted emails are sent to the backend, reducing unnecessary failed requests.                                      | Email with invalid domain (`arigato@asdwdqwqeq.com`) | ✅ Implemented |
| **F-06** | **User Login - Incorrect Credentials**       | Displays clear messages when credentials don't match system records.                                                                       | Valid email with incorrect password                  | ✅ Implemented |
| **F-06** | **User Login - Empty Fields Validation**     | Guarantees both fields (email and password) are completed before attempting login.                                                         | Form submission with empty fields                    | ✅ Implemented |
| **F-06** | **User Login - Successful Login**            | Main flow that allows authenticated users to access the system. It's the ultimate goal of the authentication process.                     | Valid email and password                             | ✅ Implemented |

---

---

## 🧪 Detailed Test Cases

### **F-01: Price Consultation**

**Status**: ❌ Not implemented in this MVP

**Planned Test Cases**:
- Display available products list
- Filter products by market/location
- Show current price for selected product
- Display price history/trends
- Handle unavailable product data gracefully

---

### **F-06: User Login - Incomplete Email Validation**

**Precondition**: User is on the login screen

**Steps**:
1. Enter incomplete email: `arigato@`
2. Enter a valid password
3. Click "Iniciar Sesión" button

**Expected Result**:
- ❌ Error message displays: "Por favor ingresa un correo electrónico válido"
- Email field border shows in red
- No backend call is made
- Button remains enabled for retry

**Reference Image**: See Image 1

---

### **F-06: User Login - Invalid Email Validation**

**Precondition**: User is on the login screen

**Steps**:
1. Enter email with non-existent domain: `arigato@asdwdqwqeq.com`
2. Enter a valid password
3. Click "Iniciar Sesión" button

**Expected Result**:
- ❌ Error message displays: "Error de conexión. Verifica tu conexión a internet."
- Form remains editable
- User can correct the email and try again

**Reference Image**: See Image 2

---

### **F-06: User Login - Incorrect Credentials**

**Precondition**: User is on the login screen

**Steps**:
1. Enter valid registered email: `arigato@hotmail.com` or `arigato@gmail.com`
2. Enter incorrect password
3. Click "Iniciar Sesión" button

**Expected Result**:
- ❌ Error message displays: "Correo o contraseña incorrectos"
- Both field borders show in red
- Fields maintain their values to facilitate correction
- "Recuperar contraseña" link remains visible

**Reference Images**: See Images 3, 4, 5, 7

---

### **F-06: User Login - Empty Fields Validation**

**Precondition**: User is on the login screen

**Steps**:
1. Leave email field empty or with only spaces
2. Leave password field empty
3. Click "Iniciar Sesión" button

**Expected Result**:
- ❌ Error message displays: "Por favor completa todos los campos"
- Both fields are highlighted indicating they are required
- No backend call is made
- Focus is placed on the first empty field

**Reference Image**: See Image 6

---

### **F-06: User Login - Successful Login**

**Precondition**: 
- User is on the login screen
- User has valid credentials registered in the system

**Steps**:
1. Enter valid registered email: `arigato@gmail.com`
2. Enter correct password
3. Click "Iniciar Sesión" button

**Expected Result**:
- ✅ User is authenticated successfully
- Authentication token is received and stored
- Redirect to main application screen
- No error messages are displayed
- Session remains active according to token expiration time

---

## ⚙️ Login Design Specifications

### **Visual Elements**:
- **Logo**: "Plaze" app icon with basket icon
- **Title**: "Inicia sesión en Plaze"
- **Avatar**: Circular user icon with light green background
- **Input fields**:
  - Email: Input with label "Correo electrónico"
  - Password: Password type input with label "Contraseña"
- **Primary button**: "Iniciar Sesión" (green background)
- **Secondary link**: "Recuperar contraseña" in green

### **Error States**:
- Red border on fields with errors
- Error message in pink/red box with descriptive text
- Error text in red color

### **Responsiveness**:
- Centered form on desktop
- Mobile-first design with max 500px width on mobile
- Vertically stacked elements

---

## 🛠️ Technologies and Tools

### **Framework**: 
- React / Angular / Vue.js (specify according to implementation)

### **Testing**:
- **Unit Testing**: Jest + React Testing Library
- **E2E Testing**: Cypress / Playwright
- **Form Validation**: Formik + Yup / React Hook Form

### **Development Tools**:
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm install --save-dev cypress
```

---

## 🐛 Common Errors and Troubleshooting

### **Backend Connection Errors**

When testing login functionality, you may encounter the following errors in the browser console:

#### **1. ERR_FAILED - 400 Bad Request**
```
Failed to load resource: the server responded with a status of 400 (Bad Request)
127.0.0.1:8000/auth/login:1
```
**Cause**: The request payload doesn't match the expected format by the backend API.

**Solutions**:
- Verify the request body structure matches the API specification
- Check that email and password fields are being sent correctly
- Ensure Content-Type header is set to `application/json`

#### **2. AxiosError - API Error**
```
API Error: AxiosError
at Object.login (api.js:241:13)
at async handleLogin (LoginPage.jsx:33:24)
```
**Cause**: Axios interceptor or request configuration error.

**Solutions**:
- Verify Axios base URL configuration points to correct backend
- Check CORS settings on backend server
- Ensure authentication headers are properly configured
- Validate error handling in API service layer

#### **3. Login Error: Correo o contraseña incorrectos**
```
Login error: Error: Correo o contraseña incorrectos
at Object.login (api.js:241:13)
at async handleLogin (LoginPage.jsx:33:24)
```
**Cause**: Valid error response from backend - credentials don't match.

**Expected Behavior**: This is the correct error handling flow when:
- User enters wrong password
- Email doesn't exist in database
- Account is deactivated or locked

#### **4. Successful Login**
```
Login successful: Object
LoginPage.jsx:35
```
**Expected Response**: Contains authentication token and user data.

### **Debugging Tips**

1. **Check Backend Status**:
```bash
# Verify backend is running
curl http://127.0.0.1:8000/health

# Test login endpoint directly
curl -X POST http://127.0.0.1:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"arigato@gmail.com","password":"yourpassword"}'
```

2. **Browser DevTools Network Tab**:
- Check request payload format
- Verify response status codes
- Inspect response headers
- Review timing to identify slow requests

3. **Console Logging**:
```javascript
// Add strategic console.logs
console.log('Login attempt:', { email, password: '***' });
console.log('API Response:', response);
console.log('Error details:', error.response?.data);
```

4. **Common Fix Patterns**:
```javascript
// Ensure proper error handling
try {
  const response = await api.login(email, password);
  console.log('Login successful:', response);
} catch (error) {
  if (error.response?.status === 400) {
    console.log('Bad request - check payload');
  } else if (error.response?.status === 401) {
    console.log('Unauthorized - incorrect credentials');
  } else {
    console.log('Network or server error');
  }
}
```

---

## 🧾 Automated Test Example

```javascript
// login.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './LoginPage';

describe('Login Flow - Smoke Tests', () => {
  
  test('F-06: Shows error with incomplete email', async () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    
    fireEvent.change(emailInput, { target: { value: 'arigato@' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/por favor ingresa un correo electrónico válido/i)).toBeInTheDocument();
    });
  });
  
  test('F-06: Shows error with empty fields', async () => {
    render(<LoginPage />);
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/por favor completa todos los campos/i)).toBeInTheDocument();
    });
  });
  
  test('F-06: Successful login with valid credentials', async () => {
    // Mock API call
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ token: 'mock-token-123' }),
    });
    
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    
    fireEvent.change(emailInput, { target: { value: 'arigato@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'correctPassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(localStorage.getItem('authToken')).toBe('mock-token-123');
    });
  });
});
```

---

## 📋 Manual Testing Checklist

Before each release, manually verify:

- [ ] **F-06**: Incomplete email shows appropriate error
- [ ] **F-06**: Invalid email handles connection error
- [ ] **F-06**: Incorrect credentials show clear message
- [ ] **F-06**: Empty fields prevent form submission
- [ ] **F-06**: Successful login redirects correctly
- [ ] Accessibility: keyboard navigation works
- [ ] Accessibility: screen readers identify fields correctly
- [ ] Responsiveness: works on mobile (320px - 480px)
- [ ] Responsiveness: works on tablet (768px - 1024px)
- [ ] Responsiveness: works on desktop (1280px+)
- [ ] "Recuperar contraseña" link redirects correctly

---

## 💡 Notes

* Smoke tests currently cover **the complete authentication flow** (F-06).
* **5 critical test cases** were identified based on the provided screenshot evidence.
* All cases are **implemented and working** according to the screenshots.
* Error messages are **clear and in Spanish**, oriented to the end user.
* The design follows **modern UX/UI principles** with immediate visual feedback.
* Each deployment must run these tests to confirm that authentication remains operational.
* **F-01 (Price Consultation)** is documented but not yet implemented in this MVP.
