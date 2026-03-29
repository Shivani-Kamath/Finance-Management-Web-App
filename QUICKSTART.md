# ⚡ Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js installed
- MongoDB running locally or connection string ready

---

## Step 1: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start the server
npm start
```

**Expected Output:**
```
✅ Server is running on port 8080
📍 API URL: http://localhost:8080
✅ MongoDB Connected Successfully!
```

---

## Step 2: Frontend Setup (2 minutes)

Open a new terminal window:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the app
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view frontend in the browser.

Local:            http://localhost:3000
```

---

## Step 3: Test the Application (1 minute)

### Register New Account
1. Go to http://localhost:3000
2. Click "Signup here"
3. Enter:
   - Name: Test User
   - Email: test@example.com
   - Password: password123 (min 6 chars)
   - Confirm: password123
4. Click "Signup"

### Login
1. Enter Email: test@example.com
2. Enter Password: password123
3. Click "Login"

### Add Your First Expense
1. In the "Dashboard" tab, scroll down to "Add New Expense"
2. Enter:
   - Description: Groceries
   - Amount: 500
   - Category: Food
3. Click "Add Expense"

### Explore Features
- **Dashboard Tab** - View summary cards and charts
- **Analytics Tab** - See spending trends (12-month)
- **Transactions Tab** - View all expenses with filters
- **Budget Tab** - Set and monitor budget

---

## 🎨 Features to Try

### Dark Mode
- Click the 🌙 icon in sidebar to toggle dark mode
- Your preference is saved automatically

### Advanced Filters
- Go to Transactions tab
- Filter by category
- Filter by date range
- Search by description

### Analytics
- View your 12-month spending trend
- See category-wise breakdown
- Check month-over-month comparison

### Budget Management
- Set your monthly budget in Budget tab
- See visual progress bar
- Get alerts when approaching limit

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 8080 in use | Change PORT in `.env` |
| MongoDB connection error | Start MongoDB service |
| CORS error | Check FRONTEND_URL in backend `.env` |
| Page won't load | Clear browser cache and refresh |
| Token error | Try logging in again |

---

## 📊 API Examples

### Test API with curl

**1. Register User**
```bash
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test",
    "email":"test@example.com",
    "password":"password123"
  }'
```

**2. Login**
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"password123"
  }'
```

Save the `accessToken` from response.

**3. Get All Expenses** (replace TOKEN with actual token)
```bash
curl -X GET http://localhost:8080/expenses \
  -H "Authorization: Bearer TOKEN"
```

**4. Add Expense**
```bash
curl -X POST http://localhost:8080/expenses \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text":"Lunch",
    "amount":300,
    "category":"Food"
  }'
```

**5. Get Analytics**
```bash
curl -X GET http://localhost:8080/expenses/analytics/insights \
  -H "Authorization: Bearer TOKEN"
```

---

## 📁 Important Files to Know

### Backend
- `backend/.env` - Configuration (DB, JWT secrets)
- `backend/index.js` - Server setup
- `backend/Controllers/AuthController.js` - Login/Signup logic
- `backend/Controllers/ExpenseController.js` - Expense operations

### Frontend
- `frontend/.env` - API URL configuration
- `frontend/src/App.js` - Routes setup
- `frontend/src/pages/Home.js` - Main dashboard
- `frontend/src/utils.js` - Helper functions

---

## 🔑 Key Features Implemented

✅ User Authentication (Signup/Login)
✅ JWT with Refresh Tokens
✅ Add/Edit/Delete Expenses
✅ Expense Categorization
✅ Budget Management
✅ Analytics Dashboard
✅ Dark Mode
✅ Advanced Filtering
✅ Responsive Design
✅ Global Error Handling

---

## 💡 Tips

1. **First Time?** - Create multiple expenses with different categories to see analytics in action
2. **Dark Mode** - Try dark mode for better night time experience
3. **Filters** - Use date filters to see spending by month
4. **Budget** - Set a budget and watch the progress bar fill up
5. **Analytics** - Switch to analytics tab to see 12-month trends

---

## 📞 Need Help?

Check the comprehensive [README.md](./README.md) for detailed documentation.

Check [IMPROVEMENTS.md](./IMPROVEMENTS.md) for all changes made.

---

## 🎉 You're All Set!

Your Expense Tracker is ready to use. Enjoy managing your finances! 💰

---

**Happy Expense Tracking! 🚀**
