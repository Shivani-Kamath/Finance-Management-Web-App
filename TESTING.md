# 🧪 Testing & Verification Guide

## Environment Setup Checklist

### Before Testing
- [ ] Node.js v14+ installed (`node --version`)
- [ ] MongoDB running and accessible
- [ ] Port 8080 available for backend
- [ ] Port 3000 available for frontend
- [ ] All `.env` files properly configured

---

## Backend Testing

### 1. Database Connection Test

**File:** `backend/.env`
**Check:**
```bash
MONGO_URI=mongodb://localhost:27017/expense_tracker
```

**Test Command:**
```bash
# In backend directory
cd backend
npm start
```

**Expected Output:**
```
✅ Server is running on port 8080
📍 API URL: http://localhost:8080
✅ MongoDB Connected Successfully!
```

**If you see this:** ✅ Connection successful
**If you see MongoDB error:** Check if MongoDB is running

---

### 2. Authentication Flow Test

**Endpoints to Test:**

#### A. Signup Endpoint
```bash
POST http://localhost:8080/auth/signup

Body (JSON):
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Expected Response (200):
{
  "success": true,
  "message": "User signed up successfully",
  "data": { "id": "...", "name": "John Doe", "email": "john@example.com" }
}
```

**Common Errors:**
- `400 Bad Request` - Invalid email or password too short
- `409 Conflict` - Email already exists
- `500 Server Error` - Database issue

#### B. Login Endpoint
```bash
POST http://localhost:8080/auth/login

Body (JSON):
{
  "email": "john@example.com",
  "password": "password123"
}

Expected Response (200):
{
  "success": true,
  "message": "User logged in successfully",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com" }
}
```

**Troubleshooting:**
- Store `accessToken` and `refreshToken` for next tests
- Invalid credentials will return 401

#### C. Refresh Token Endpoint
```bash
POST http://localhost:8080/auth/refresh

Headers:
{
  "Authorization": "Bearer <refreshToken>"
}

Expected Response (200):
{
  "success": true,
  "accessToken": "eyJhbGc..." (new token)
}
```

---

### 3. Expense Operations Test

**Use the accessToken from login in Authorization header**

#### A. Add Expense
```bash
POST http://localhost:8080/expenses

Headers:
{
  "Authorization": "Bearer <accessToken>",
  "Content-Type": "application/json"
}

Body:
{
  "text": "Grocery Shopping",
  "amount": 1500,
  "category": "Food"
}

Expected Response (200):
{
  "success": true,
  "message": "Transaction added successfully",
  "data": { "id": "...", "text": "Grocery Shopping", "amount": 1500, "category": "Food", "createdAt": "2024-..." }
}
```

**Validation Rules:**
- amount must be > 0
- category required
- text/description required

#### B. Get All Expenses
```bash
GET http://localhost:8080/expenses

Headers:
{
  "Authorization": "Bearer <accessToken>"
}

Expected Response (200):
{
  "success": true,
  "data": [
    { "id": "...", "text": "...", "amount": "...", "category": "...", "createdAt": "..." },
    { "id": "...", "text": "...", "amount": "...", "category": "...", "createdAt": "..." }
  ]
}
```

#### C. Delete Expense
```bash
DELETE http://localhost:8080/expenses/:id

Headers:
{
  "Authorization": "Bearer <accessToken>"
}

Expected Response (200):
{
  "success": true,
  "message": "Transaction deleted successfully"
}
```

#### D. Update Expense
```bash
PUT http://localhost:8080/expenses/:id

Headers:
{
  "Authorization": "Bearer <accessToken>",
  "Content-Type": "application/json"
}

Body:
{
  "text": "Updated Description",
  "amount": 2000,
  "category": "Food"
}

Expected Response (200):
{
  "success": true,
  "message": "Transaction updated successfully",
  "data": { updated expense object }
}
```

---

### 4. Analytics Test

#### A. Get Monthly Trend (Last 12 Months)
```bash
GET http://localhost:8080/expenses/analytics/monthly-trend

Headers:
{
  "Authorization": "Bearer <accessToken>"
}

Expected Response (200):
{
  "success": true,
  "data": [
    { "month": "2024-01", "total": 5000 },
    { "month": "2024-02", "total": 4500 },
    ...
  ]
}
```

#### B. Get Category Breakdown (Current Month)
```bash
GET http://localhost:8080/expenses/analytics/category-breakdown

Headers:
{
  "Authorization": "Bearer <accessToken>"
}

Expected Response (200):
{
  "success": true,
  "data": [
    { "category": "Food", "count": 5, "total": 2500 },
    { "category": "Transport", "count": 3, "total": 1000 },
    ...
  ]
}
```

#### C. Get Spending Insights
```bash
GET http://localhost:8080/expenses/analytics/insights

Headers:
{
  "Authorization": "Bearer <accessToken>"
}

Expected Response (200):
{
  "success": true,
  "data": {
    "currentMonthTotal": 5000,
    "monthOverMonthChange": -10.5,
    "topCategories": ["Food", "Transport", "Entertainment"],
    "message": "10.5% less than last month"
  }
}
```

#### D. Get Analytics Overview
```bash
GET http://localhost:8080/expenses/analytics

Headers:
{
  "Authorization": "Bearer <accessToken>"
}

Expected Response (200):
{
  "success": true,
  "data": {
    "monthlyTotal": 5000,
    "transactionCount": 10,
    "averageExpense": 500,
    "categoryCount": 4
  }
}
```

---

### 5. Budget Test

#### A. Set Budget
```bash
POST http://localhost:8080/budget

Headers:
{
  "Authorization": "Bearer <accessToken>",
  "Content-Type": "application/json"
}

Body:
{
  "amount": 50000
}

Expected Response (200):
{
  "success": true,
  "message": "Budget set successfully",
  "data": { "userId": "...", "amount": 50000, "month": "2024-01", "createdAt": "..." }
}
```

#### B. Get Budget
```bash
GET http://localhost:8080/budget

Headers:
{
  "Authorization": "Bearer <accessToken>"
}

Expected Response (200):
{
  "success": true,
  "data": { "userId": "...", "amount": 50000, "month": "2024-01", "spent": 5000 }
}
```

#### C. Update Budget
```bash
PUT http://localhost:8080/budget

Headers:
{
  "Authorization": "Bearer <accessToken>",
  "Content-Type": "application/json"
}

Body:
{
  "amount": 60000
}

Expected Response (200):
{
  "success": true,
  "message": "Budget updated successfully"
}
```

---

## Frontend Testing

### 1. Component Rendering Test

**Check Browser Console** (`F12` → Console tab)

**Expected:** No major errors
**Look for:** Any network errors or missing dependencies

### 2. Authentication Flow Test

#### Signup Page
- [ ] Form accepts name, email, password, confirm password
- [ ] Shows validation errors for:
  - Name < 3 characters
  - Invalid email format
  - Password < 6 characters
  - Password mismatch
- [ ] Loading spinner appears during submission
- [ ] Success redirects to login
- [ ] Error shows proper message

#### Login Page
- [ ] Form accepts email and password
- [ ] Loading spinner appears during submission
- [ ] Invalid credentials show error
- [ ] Success redirects to home
- [ ] Tokens stored in localStorage

**Verify Token Storage:**
```javascript
// In browser console
localStorage.getItem('accessToken')  // Should return JWT token
localStorage.getItem('refreshToken') // Should return JWT token
localStorage.getItem('user')         // Should return user object
```

### 3. Home Page Test

#### Dashboard Tab
- [ ] Summary cards display (Income, Expense, Balance, Savings Rate)
- [ ] Charts render correctly
- [ ] Add expense form works
- [ ] Expense list shows recent transactions
- [ ] Dark mode toggle works

#### Analytics Tab
- [ ] 12-month trend line chart displays
- [ ] Category pie chart displays
- [ ] Spending insights card shows
- [ ] Charts update when new expense added

#### Transactions Tab
- [ ] All expenses listed in table
- [ ] Filter by category works
- [ ] Filter by date range works
- [ ] Search by description works
- [ ] Delete button works
- [ ] Table is responsive on mobile

#### Budget Tab
- [ ] Budget form displays
- [ ] Can set/update budget
- [ ] Progress bar shows correctly
- [ ] Displays "On Track" / "Warning" / "Over Budget"

### 4. Dark Mode Test
- [ ] Toggle in sidebar works
- [ ] Colors change appropriately
- [ ] Setting persists on page reload
- [ ] Works on all pages

### 5. Responsive Design Test

**Desktop (1920x1080)**
- [ ] Sidebar visible on left
- [ ] Content area properly aligned
- [ ] All buttons clickable

**Tablet (768x1024)**
- [ ] Sidebar collapses to icon only
- [ ] Content fills available width
- [ ] Touch targets are adequate

**Mobile (375x667)**
- [ ] Hamburger menu shows
- [ ] Sidebar slides in on mobile
- [ ] Table scrollable horizontally
- [ ] Forms stack vertically
- [ ] All buttons tappable

---

## Error Scenarios Test

### 1. Invalid Token
```bash
# Try accessing protected endpoint with invalid token
curl -X GET http://localhost:8080/expenses \
  -H "Authorization: Bearer invalid_token"

Expected: 401 Unauthorized
"Invalid token"
```

### 2. Expired Token
After 15 minutes of login, the accessToken expires.
- [ ] Frontend should auto-refresh token
- [ ] User should not be logged out
- [ ] New accessToken should be obtained
- [ ] Request should retry with new token

### 3. Database Error
Stop MongoDB and try adding expense:
- [ ] Should show proper error message
- [ ] Not crash the app
- [ ] Allow recovery when DB comes back

### 4. Missing Required Fields
```bash
POST http://localhost:8080/expenses
Body: { "amount": 100 }  # Missing "text" and "category"

Expected: 400 Bad Request with validation error
```

---

## Performance Test

### 1. Add Multiple Expenses
- [ ] Can add 100+ expenses
- [ ] App doesn't slow down
- [ ] Filter/search still responsive

### 2. Analytics with Large Dataset
- [ ] Charts render smoothly with 1000+ expenses
- [ ] Switching tabs responsive
- [ ] Dark mode toggle instant

### 3. Network Tab Check (Dev Tools)
- [ ] API calls complete in < 500ms
- [ ] No duplicate requests
- [ ] Proper HTTP methods used (GET/POST/PUT/DELETE)

---

## Quick Health Check (1 minute)

```bash
# Terminal 1: Start Backend
cd backend
npm start
# Expected: "Server is running on port 8080" + "MongoDB Connected"

# Terminal 2: Start Frontend
cd frontend
npm start
# Expected: "Compiled successfully!"

# Browser: Go to http://localhost:3000
# Expected: Login page loads without errors
```

---

## Known Behaviors (Not Bugs)

✅ Token refresh happens silently (no user notification)
✅ Analytics tab shows empty on first month of data
✅ Dark mode may need page refresh on first toggle (localStorage sync)
✅ CSV export button not yet implemented (easy to add)
✅ PDF export button not yet implemented (easy to add)

---

## Need More Help?

- Check browser console for JavaScript errors: `F12 → Console`
- Check network calls: `F12 → Network`
- Check stored data: `F12 → Application → Local Storage`
- Review backend logs for server errors

---

**Ready to test? Follow the QUICKSTART.md guide!** ⚡
