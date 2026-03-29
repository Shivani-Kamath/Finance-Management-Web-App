# 🆘 Troubleshooting & FAQ

## Common Issues & Solutions

---

## 🔴 Backend Issues

### Issue 1: MongoDB Connection Fails

**Error Message:**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
MongoDB connection failed!
```

**Causes:**
- MongoDB is not running
- Wrong MongoDB URI in `.env`
- MongoDB not installed

**Solutions:**

**Windows:**
```bash
# Check if MongoDB is running
Get-Service MongoDB

# Start MongoDB if stopped
Start-Service MongoDB

# Or manually start mongod
mongod
```

**Mac:**
```bash
# Check if running
brew services list | grep mongodb

# Start MongoDB
brew services start mongodb-community

# Or manually start
mongod
```

**Linux:**
```bash
# Check status
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

**For MongoDB Atlas (Cloud):**
```bash
# Check connection string in .env
# Should look like: mongodb+srv://username:password@cluster.mongodb.net/dbname

# Common issues:
# 1. Wrong password
# 2. IP not whitelisted (add 0.0.0.0/0 in Network Access)
# 3. Wrong database name
```

---

### Issue 2: Port 8080 Already in Use

**Error Message:**
```
Error: listen EADDRINUSE :::8080
```

**Solutions:**

**Find what's using port 8080:**
```bash
# Windows
netstat -ano | findstr :8080

# Mac/Linux
lsof -i :8080
```

**Kill the process:**
```bash
# Windows (replace PID with actual number)
taskkill /PID 1234 /F

# Mac/Linux
kill -9 <PID>
```

**Or use a different port:**
```bash
# In backend/.env
PORT=8081  # or any other free port

# Also update frontend .env
REACT_APP_API_URL=http://localhost:8081
```

---

### Issue 3: Invalid JWT Secret Errors

**Error Message:**
```
jwt malformed
Unable to verify token
```

**Problem:**
- JWT_SECRET not set in `.env`
- JWT_SECRET changed after tokens created
- Multiple servers with different secrets

**Solution:**
```bash
# In backend/.env
JWT_SECRET=your_super_duper_secret_key_at_least_20_characters_long
REFRESH_JWT_SECRET=another_super_duper_secret_key_at_least_20_characters

# Make sure these are:
# - Same across all backend servers (in production)
# - Not logged or exposed
# - At least 20 characters
# - Random and strong
```

**Generate Random Secret:**
```javascript
// Run in Node.js console
require('crypto').randomBytes(32).toString('hex')
```

---

### Issue 4: CORS Errors

**Error Message:**
```
Access to XMLHttpRequest at 'http://localhost:8080/...' 
blocked by CORS policy
```

**Problem:**
- FRONTEND_URL not matching in backend `.env`
- Frontend and backend on different origins

**Solution:**
```bash
# In backend/.env
FRONTEND_URL=http://localhost:3000  # For local development

# For production
FRONTEND_URL=https://your-frontend-domain.com

# Restart backend after change
```

**In backend/index.js, verify CORS is configured:**
```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true
};
app.use(cors(corsOptions));
```

---

### Issue 5: Cannot Add Expenses - "Category Required" Error

**Problem:**
- Frontend sending wrong field names
- ExpenseController validation failing

**Solution:**
```bash
# Check what backend expects:
# POST /expenses
# {
#   "text": "description",
#   "amount": 500,
#   "category": "Food"
# }

# If using "description" instead of "text", check ExpenseTable.js
# Frontend should send exact field names backend expects
```

---

## 🔴 Frontend Issues

### Issue 1: Login Page Shows But Can't Login

**Error Message:**
```
Failed to fetch /auth/login
TypeError: Failed to fetch
```

**Causes:**
- Backend not running
- Wrong API URL in `.env`
- CORS issue

**Solutions:**

**Check backend is running:**
```bash
# In new terminal
cd backend
npm start

# Should show: "Server is running on port 8080"
```

**Verify frontend API URL:**
```bash
# In frontend/.env
REACT_APP_API_URL=http://localhost:8080

# Should NOT have trailing slash
# Should NOT have quotes
```

**Restart frontend:**
```bash
cd frontend
npm start
```

---

### Issue 2: Invalid Email Error on Signup

**Error Message:**
```
Invalid email format
```

**Problem:**
- Email format validation too strict
- Space in email
- Special characters

**Solution:**
```bash
# Valid emails:
user@example.com     ✅
john.doe@company.co  ✅

# Invalid emails:
user@example         ❌ (no domain extension)
user @example.com    ❌ (space)
user..name@ex.com    ❌ (double dot)
```

**Check validation in Signup.js:**
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  // Show error
}
```

---

### Issue 3: Password Confirmation Mismatch Error

**Error Message:**
```
Passwords do not match
```

**Problem:**
- Typed passwords differently
- Caps lock on
- Extra spaces

**Solutions:**
- Retype both passwords carefully
- Check Caps Lock
- Remove leading/trailing spaces

---

### Issue 4: Token Expired, Can't Access Dashboard

**Error Message:**
```
Unauthorized - Invalid token
```

**Problem:**
- Token expired (15 minute expiry)
- Token corrupted in localStorage
- Session timeout

**Solutions:**

**Log in again:**
```bash
# Go to login page
# Enter credentials
# Should get new tokens
```

**Clear localStorage:**
```javascript
// In browser console:
localStorage.clear()

// Then refresh page and login again
```

**Check localStorage is enabled:**
- Ensure browser allows localStorage
- Some incognito windows disable it

---

### Issue 5: Dark Mode Not Working

**Problem:**
- Toggle doesn't switch colors
- Setting not saved

**Solutions:**

**Verify dark mode code in Home.js:**
```javascript
const [darkMode, setDarkMode] = useState(() => {
  const saved = localStorage.getItem('darkMode');
  return saved ? JSON.parse(saved) : false;
});

// Save when toggled
useEffect(() => {
  localStorage.setItem('darkMode', JSON.stringify(darkMode));
}, [darkMode]);
```

**Check Tailwind config includes dark mode:**
```javascript
// frontend/tailwind.config.js
module.exports = {
  darkMode: 'class', // or 'media'
  // ...
}
```

**Manual fix:**
```javascript
// In browser console
localStorage.setItem('darkMode', 'false')
location.reload()
```

---

### Issue 6: Charts Not Showing in Analytics

**Error in Console:**
```
Recharts error
Cannot read property 'data' of undefined
```

**Problem:**
- API not returning data
- Data format mismatch
- Charts not rendered

**Solutions:**

**Check API response:**
```javascript
// In browser console
fetch('http://localhost:8080/expenses/analytics', {
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') }
})
.then(r => r.json())
.then(d => console.log(d))
```

**Verify data format matches chart:**
```javascript
// For LineChart, data should be:
[
  { month: "2024-01", total: 5000 },
  { month: "2024-02", total: 4500 }
]

// For PieChart, data should be:
[
  { category: "Food", count: 5 },
  { category: "Transport", count: 3 }
]
```

---

### Issue 7: Expenses Not Showing in Table

**Problem:**
- Added expense but doesn't appear
- Table empty even after adding

**Solutions:**

**Verify expense was added:**
```javascript
// In browser console, run:
fetch('http://localhost:8080/expenses', {
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') }
})
.then(r => r.json())
.then(d => console.log(d))

// Should show list of expenses
```

**Check Home.js calls fetchExpenses:**
```javascript
// After adding expense, should call:
await fetchExpenses();
```

**Try refreshing:**
```bash
# Press Ctrl+R or Cmd+R to reload page
```

---

## 🔴 General Issues

### Issue 1: "Cannot find module" Error

**Error:**
```
Error: Cannot find module 'express'
Error: Cannot find module 'react'
```

**Solution:**
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install

# Make sure package.json exists in each folder
```

---

### Issue 2: "npm command not found"

**Problem:**
- Node.js not installed
- npm not in PATH

**Solution:**

**Download Node.js:**
- Visit [nodejs.org](https://nodejs.org)
- Download LTS version
- Install with default settings

**Verify installation:**
```bash
node --version   # Should show v18.x or higher
npm --version    # Should show version
```

---

### Issue 3: Port 3000 (Frontend) Already in Use

**Error:**
```
Something is already running on port 3000
```

**Solutions:**

**Find and kill process:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

**Or use different port:**
```bash
# In frontend directory
PORT=3001 npm start
```

---

### Issue 4: Blank Page After Login

**Problem:**
- Page loads but shows nothing
- No errors in console

**Solutions:**

**Check for JavaScript errors:**
```bash
# Press F12
# Click Console tab
# Look for red errors
```

**Verify user data in localStorage:**
```javascript
// In console:
JSON.parse(localStorage.getItem('user'))

// Should show user object with name, email, id
```

**Clear cache and reload:**
```bash
# Ctrl+Shift+Delete (Windows)
# Cmd+Shift+Delete (Mac)
# Select "Cached images and files"
# Click Clear
```

---

### Issue 5: Slow Performance

**Causes:**
- Too many expenses (100+)
- Browser cache full
- Backend slow

**Solutions:**

**Optimize frontend:**
```bash
# Create optimized build
cd frontend
npm run build

# Check bundle size
npm install -g webpack-bundle-analyzer
```

**Optimize backend:**
```bash
# Add database indexes
# In MongoDB:
db.expenses.createIndex({ category: 1 })
db.expenses.createIndex({ createdAt: -1 })
```

**Clear browser cache:**
```bash
# F12 → Application → Local Storage → Clear All
```

---

## ✅ Testing Checklist

Use this to verify everything works:

- [ ] Backend starts without errors
- [ ] Frontend loads without CORS errors
- [ ] Signup form accepts valid input
- [ ] Login with correct credentials works
- [ ] Dashboard loads with summary cards
- [ ] Can add new expense
- [ ] Expense appears in table immediately
- [ ] Can delete expense
- [ ] Analytics tab shows charts
- [ ] Filter by category works
- [ ] Filter by date range works
- [ ] Search by text works
- [ ] Dark mode toggles colors
- [ ] Budget can be set and updated
- [ ] Logout works
- [ ] Can login again after logout

---

## 📋 Quick Diagnostics

**Run these checks when something breaks:**

### Backend Check
```bash
cd backend

# 1. Dependencies installed?
npm ls express mongoose

# 2. Environment file exists?
cat .env

# 3. Start server
npm start

# Expected: "Server is running on port 8080"
```

### Frontend Check
```bash
cd frontend

# 1. Dependencies installed?
npm ls react react-router-dom

# 2. Environment file exists?
cat .env

# 3. Start frontend
npm start

# Expected: "Compiled successfully!"
```

### Database Check
```bash
# MongoDB running?
mongosh

# Expected: Connection to 127.0.0.1:27017

# Or check MongoDB Atlas:
# 1. Log in to atlas.mongodb.com
# 2. Check cluster status
# 3. Verify IP whitelist includes your IP
```

---

## 📞 Getting Help

### Debug Message Template
When reporting issues, include:

```
Environment: Windows/Mac/Linux
Backend: Running/Not Running
Frontend: Running/Not Running
Error Message: [exact error text]
What I Did: [steps to reproduce]
Console Errors: [if any]
```

### Useful Commands for Debugging

```bash
# See backend logs
cd backend && npm start 2>&1 | tee backend.log

# See frontend logs
cd frontend && npm start 2>&1 | tee frontend.log

# Test API endpoint
curl -X GET http://localhost:8080/auth/login

# Check network requests
# Browser F12 → Network tab → Try action → Check calls
```

---

## 🎯 If All Else Fails

### Nuclear Option (Complete Fresh Start)

```bash
# 1. Kill all running processes
# Windows: Close all terminals

# 2. Clear all data
rm -rf node_modules
rm -rf build
rm package-lock.json

# 3. Reload dependencies
npm install

# 4. Clear browser data
# F12 → Application → Clear All

# 5. Start fresh
npm start
```

---

## Resources

- [Node.js Docs](https://nodejs.org/en/docs/)
- [Express.js Troubleshooting](https://expressjs.com)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [MongoDB Docs](https://docs.mongodb.com)
- [VS Code Debugging](https://code.visualstudio.com/docs/editor/debugging)

---

**Still stuck? Check the other guide files:**
- `QUICKSTART.md` - Getting started
- `TESTING.md` - Testing procedures
- `DEPLOYMENT.md` - Deployment help
- `README.md` - Project overview
- `IMPROVEMENTS.md` - What was changed

---

**You got this! 💪 Most issues have simple solutions.**
