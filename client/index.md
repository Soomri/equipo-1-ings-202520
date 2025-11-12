# 🎨 Frontend Testing

This section documents the **Smoke Test** for the frontend module.
It identifies the most critical UI flows that must be validated after each deployment to ensure the system remains functional and stable.

---

## 🚀 Smoke Test — Critical Flows

| ID       | Flow Tested                                  | Why It's Critical                                                                                                                               | Test Cases                                           | Implemented   |
| -------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ------------- |
| **F-01** | **Price Consultation - Search Input**        | Allows users to enter product name to search. First interaction point for price consultation. Without this, users cannot initiate queries.      | Enter product name in search input                   | ✅ Implemented |
| **F-01** | **Price Consultation - Market Filter**       | Enables filtering by specific market (plaza). Essential for location-specific pricing, which varies significantly across markets.               | Select market from "Filter by markets" dropdown      | ✅ Implemented |
| **F-01** | **Price Consultation - Display Results**     | Shows complete price information including current price, variation, average price, trend, and historical chart. Core value proposition.        | Click "Search prices" and view results page          | ✅ Implemented |
| **F-01** | **Price Consultation - Period Selection**    | Allows viewing price history for different time periods (3, 6, 12 months). Critical for understanding price trends and patterns.                | Switch between 3, 6, and 12 month period buttons     | ✅ Implemented |
| **F-01** | **Price Consultation - Handle No Data**      | Displays clear error message (404) when product has no historical data. Prevents crashes and provides user feedback with retry option.          | Search for product with no data                      | ✅ Implemented |
| **F-06** | **User Login - Incomplete Email Validation** | Prevents users from attempting authentication with invalid emails. Client-side validation improves UX before calling the API.                   | Email without complete domain (`arigato@`)           | ✅ Implemented |
| **F-06** | **User Login - Invalid Email Validation**    | Ensures only properly formatted emails are sent to the backend, reducing unnecessary failed requests.                                           | Email with invalid domain (`arigato@asdwdqwqeq.com`) | ✅ Implemented |
| **F-06** | **User Login - Incorrect Credentials**       | Displays clear messages when credentials don't match system records.                                                                            | Valid email with incorrect password                  | ✅ Implemented |
| **F-06** | **User Login - Empty Fields Validation**     | Guarantees both fields (email and password) are completed before attempting login.                                                              | Form submission with empty fields                    | ✅ Implemented |
| **F-06** | **User Login - Successful Login**            | Main flow that allows authenticated users to access the system. It's the ultimate goal of the authentication process.                          | Valid email and password                             | ✅ Implemented |

---

## 🧪 Detailed Test Cases

### **F-01: Price Consultation - Search Input**

**Status**: ✅ Implemented

**Precondition**: User is on the price consultation page (home screen or main search page)

**Steps**:
1. Navigate to the price consultation page
2. Locate the search input field with placeholder "Buscar un producto" (Search a product)
3. Enter a product name in the search input (e.g., "Ajito", "Mayonesa Doy Pack", "Gelatina")
4. Observe the search functionality

**Expected Result**:
- ✅ Search input field is visible and accessible
- Input accepts text entry without errors
- User can type product names smoothly
- Search input maintains focus during typing
- System prepares to process the search query

**Reference Images**: 
  ![search-input-ajito](images/testing/search-input-ajito.png) 
  - Shows "Ajito" entered in search field
  ![search-input-gelatina](images/testing/search-input-gelatina.png) 
  - Shows "Gelatina" being searched

---

### **F-01: Price Consultation - Market Filter**

**Status**: ✅ Implemented

**Precondition**: 
- User is on the price consultation page
- A product has been entered in the search field

**Steps**:
1. Enter a product name in the search field (e.g., "Mayonesa Doy Pack")
2. Click on "Filtrar por plazas" (Filter by markets) button or link
3. View the market filter dropdown/modal that appears
4. Select a specific market from the dropdown (e.g., "Central Mayorista De Antioquia - Medellín")
5. Verify the filter is applied
6. Click "Buscar precios" (Search prices) button

**Expected Result**:
- ✅ "Filtrar por plazas" option is visible and clickable
- Dropdown displays available markets including "Todas las plazas de mercado" (All markets) option
- Selected market is highlighted in the filter section
- Filter indicator shows "Filtrando por: [Market Name]" below the product title
- System displays message "Buscando en: [Market Name]" when filter is active
- User can clear the filter with "Ocultar filtros" (Hide filters) or "Limpiar filtro" (Clear filter) options
- Search executes with the market filter applied

**Reference Images**:
  ![market-filter-closed](images/testing/market-filter-closed.png) 
  - Shows "Filtrar por plazas" button
  ![market-filter-open](images/testing/market-filter-open.png) 
  - Shows market dropdown with "Central Mayorista De Antioquia" selected
  ![market-filter-applied](images/testing/market-filter-applied.png) 
  - Shows active filter indicator "Filtrando por: Central Mayorista De Antioquia"

---

### **F-01: Price Consultation - Display Results**

**Status**: ✅ Implemented

**Precondition**: 
- User has entered a valid product name
- Optional: Market filter has been applied
- User has clicked "Buscar precios" button

**Steps**:
1. Enter product name (e.g., "Ajo", "Mayonesa Doy Pack", "Gelatina")
2. Optionally select a market filter
3. Click "Buscar precios" button
4. Wait for results page to load
5. Observe the displayed price information

**Expected Result**:
- ✅ Results page displays with product name as title
- Four main information cards are visible:
  1. **Current Price Card (Precio Actual)** - Shows current price with currency symbol (e.g., "$15.210")
  2. **Variation Card (Variación)** - Shows percentage change with arrow indicator (e.g., "+33.41%", "+10.18%", "+2.11%")
  3. **Average Price Card (Precio Promedio)** - Shows calculated average price (e.g., "$13.291,42")
  4. **Trend Card (Tendencia)** - Shows trend direction ("Aumento" for increase, "Estabilidad" for stable)
- Historical price chart titled "Histórico de Precios" is displayed below the cards
- Chart shows price evolution over time with data points and trend line
- Orange dotted line indicates "Actual" (current) price level
- "Volver" (Back) button is available for navigation
- If market filter was applied, indicator shows "Filtrando por: [Market Name]"

**Reference Images**:
- ![display-results-ajo-12months](images/testing/display-results-ajo-12months.png) 
  Shows "Ajo" with 12-month data, +33.41% variation, "Aumento" trend
- ![display-results-ajo-6months](images/testing/display-results-ajo-6months.png) 
  Shows "Ajo" with 6-month data, +10.18% variation, "Aumento" trend
- ![display-results-ajo-3months](images/testing/display-results-ajo-3months.png) 
  Shows "Ajo" with 3-month data, +2.11% variation, "Estabilidad" trend
- ![display-results-mayonesa](images/testing/display-results-mayonesa.png) 
  Shows "Mayonesa Doy Pack" filtered by Central Mayorista, +34.76% variation
- ![display-results-gelatina](images/testing/display-results-gelatina.png) 
  Shows "Gelatina" with +29.33% variation, "Aumento" trend

---

### **F-01: Price Consultation - Period Selection**

**Status**: ✅ Implemented

**Precondition**: 
- User is viewing price details for a product
- Historical price data is available

**Steps**:
1. On the price details page, locate the period selection buttons in the top-right
2. Observe the three available period options: "3 meses", "6 meses", "12 meses"
3. Click on "12 meses" (12 months) button
4. Wait for chart to update
5. Click on "6 meses" (6 months) button
6. Wait for chart to update
7. Click on "3 meses" (3 months) button
8. Verify the final chart update

**Expected Result**:
- ✅ Three period buttons are visible: "3 meses", "6 meses", "12 meses"
- Currently selected period button is highlighted with green background
- Non-selected buttons have white/light background
- Chart updates smoothly when switching periods showing different time ranges:
  - **12 months**: Shows full year price evolution with more data points
  - **6 months**: Shows mid-term trends with moderate data density
  - **3 months**: Shows recent trends with fewer data points
- Price cards (Precio Actual, Variación, Precio Promedio, Tendencia) recalculate based on selected period
- Variation percentage changes according to period:
  - 12 months: +33.41%
  - 6 months: +10.18%
  - 3 months: +2.11%
- Trend indicator may change based on period ("Aumento" vs "Estabilidad")
- Loading state (if any) is brief and non-intrusive
- X-axis of chart adjusts to show appropriate date labels for the period

**Reference Images**:
  ![period-12months](images/testing/period-12months.png) 
  - "Ajo" with 12 months selected (green button), shows +33.41% variation
  ![period-6months](images/testing/period-6months.png) 
  - "Ajo" with 6 months selected (green button), shows +10.18% variation
  ![period-3months](images/testing/period-3months.png) 
  - "Ajo" with 3 months selected (green button), shows +2.11% variation

---

### **F-01: Price Consultation - Handle No Data**

**Status**: ✅ Implemented

**Precondition**: 
- User is on the price consultation page
- A product with no price history exists in the system or an invalid product is searched

**Steps**:
1. Navigate to price consultation page
2. Enter a product name that has no historical data (e.g., "Ajito")
3. Optionally apply market filter
4. Click "Buscar precios" button
5. Wait for the system response

**Expected Result**:
- ❌ Clear error page displays with title "Error al cargar datos" (Error loading data)
- Error icon (⚠️ or ℹ️) is visible at the top of the error message
- Specific error message shows: "Error 404: No se encontraron datos históricos para '[Product Name]' en los últimos 12 meses."
  - Example: "Error 404: No se encontraron datos históricos para 'Ajito' en los últimos 12 meses."
- A green button labeled "Intentar nuevamente" (Try again) is prominently displayed
- "Volver" (Back) button remains available for navigation
- No broken charts or undefined values are displayed
- Page layout remains intact and professional
- Application remains stable and functional
- Console shows no critical errors
- User can click "Intentar nuevamente" to retry the search
- User can click "Volver" to return to the search page

**Reference Images**:
  ![handle-no-data](images/testing/handle-no-data.png) 
  - Shows error page for "Ajito" with 404 message and "Intentar nuevamente" button

---

### **F-06: User Login - Incomplete Email Validation**

**Status**: ✅ Implemented

**Precondition**: User is on the login screen

**Steps**:
1. Enter incomplete email: `arigato@`
2. Enter a valid password
3. Click "Iniciar Sesión" (Log In) button

**Expected Result**:
- ❌ Error message displays: "Por favor ingresa un correo electrónico válido" (Please enter a valid email address)
- Email field border shows in red
- No backend call is made
- Button remains enabled for retry

**Reference Image**: ![login-incomplete-email](images/testing/login-incomplete-email.png)

---

### **F-06: User Login - Invalid Email Validation**

**Status**: ✅ Implemented

**Precondition**: User is on the login screen

**Steps**:
1. Enter email with non-existent domain: `arigato@gmail.co`
2. Enter a valid password
3. Click "Iniciar Sesión" button

**Expected Result**:
- ❌ Error message displays: "Correo o contraseña incorrectos" (Incorrect email or password)
- Email field border shows in red
- No backend call is made
- Button remains enabled for retry

**Reference Image**: ![login-invalid-email](images/testing/login-invalid-email.png)

---

### **F-06: User Login - Incorrect Credentials**

**Status**: ✅ Implemented

**Precondition**: User is on the login screen

**Steps**:
1. Enter valid registered email: `arigato@hotmail.com` or `arigato@gmail.com`
2. Enter incorrect password
3. Click "Iniciar Sesión" button

**Expected Result**:
- ❌ Error message displays: "Correo o contraseña incorrectos" (Incorrect email or password)
- Both field borders show in red
- Fields maintain their values to facilitate correction
- "Recuperar contraseña" (Recover password) link remains visible

**Reference Images**: ![login-incorrect-credentials](images/testing/login-incorrect-credentials.png)

---

### **F-06: User Login - Empty Fields Validation**

**Status**: ✅ Implemented

**Precondition**: User is on the login screen

**Steps**:
1. Leave email field empty or with only spaces
2. Leave password field empty
3. Click "Iniciar Sesión" button

**Expected Result**:
- ❌ Error message displays: "Por favor completa todos los campos" (Please complete all fields)
- Both fields are highlighted indicating they are required
- No backend call is made
- Focus is placed on the first empty field

**Reference Images**: ![login-empty-fields-validation-1](images/testing/login-empty-fields-validation-1.png) ![login-empty-fields-validation-2](images/testing/login-empty-fields-validation-2.png)

---

### **F-06: User Login - Successful Login**

**Status**: ✅ Implemented

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
- Redirect to main application screen (price consultation page)
- User sees personalized greeting "Hola, arigatito" in top navigation
- No error messages are displayed
- Session remains active according to token expiration time

**Reference Images**: ![login-successful-login](images/testing/login-successful-login.png)

---

## 📋 Manual Testing Checklist

Before each release, manually verify:

### Price Consultation (F-01)
- [ ] **F-01**: Search input accepts product names correctly
- [ ] **F-01**: "Filtrar por plazas" button opens market filter dropdown
- [ ] **F-01**: Market selection updates filter indicator
- [ ] **F-01**: "Buscar precios" executes search with applied filters
- [ ] **F-01**: Price details page displays all 4 information cards correctly
- [ ] **F-01**: Historical price chart renders with proper data points
- [ ] **F-01**: Period buttons (3, 6, 12 months) are visible and functional
- [ ] **F-01**: Clicking period buttons updates chart and statistics
- [ ] **F-01**: Variation percentage recalculates for each period
- [ ] **F-01**: Trend indicator updates appropriately (Aumento/Estabilidad)
- [ ] **F-01**: "Volver" button navigates back to search page
- [ ] **F-01**: Error 404 page displays for products with no data
- [ ] **F-01**: "Intentar nuevamente" button allows retry after error
- [ ] **F-01**: Market filter indicator shows correctly on results page

### Login (F-06)
- [ ] **F-06**: Incomplete email shows appropriate error
- [ ] **F-06**: Invalid email shows error message
- [ ] **F-06**: Incorrect credentials show clear message
- [ ] **F-06**: Empty fields prevent form submission
- [ ] **F-06**: Successful login redirects to main page
- [ ] **F-06**: User greeting displays after successful login
- [ ] Accessibility: keyboard navigation works
- [ ] Accessibility: screen readers identify fields correctly

### Responsiveness
- [ ] Works on mobile (320px - 480px)
- [ ] Works on tablet (768px - 1024px)
- [ ] Works on desktop (1280px+)
- [ ] Search input is accessible on all screen sizes
- [ ] Market filter dropdown is usable on mobile
- [ ] Price cards stack properly on mobile
- [ ] Chart is readable and interactive on all devices

---

## 💡 Notes

* Smoke tests currently cover **the complete authentication flow** (F-06) and **complete price consultation flow** (F-01).
* **10 critical test cases** were identified and **all are implemented and working** ✅
* **F-01** includes 5 test cases covering the full price consultation workflow from search to results display
* **F-06** includes 5 test cases covering the complete authentication process
* All error messages are **clear and in Spanish**, oriented to the end user
* The design follows **modern UX/UI principles** with immediate visual feedback
* Market filtering (F-26) is integrated into F-01 test cases
* Each deployment must run these tests to confirm that core functionality remains operational
* Reference images from actual implementation are provided for visual verification