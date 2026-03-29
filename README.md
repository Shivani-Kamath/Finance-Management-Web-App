# 💰 Expense Tracker - MERN Stack Application

A modern, production-ready expense management application built with MongoDB, Express, React, and Node.js. This application helps users track income and expenses, analyze spending patterns, and manage budgets effectively.

## 🎯 Key Features

### ✅ Core Functionality
- **User Authentication** - Secure signup/login with JWT tokens
- **Expense Management** - Add, edit, delete expenses with categorization
- **Income Tracking** - Record and track income sources
- **Budget Management** - Set monthly budget and receive alerts when exceeded
- **Dynamic Dashboard** - Real-time calculation of balance, income, and expenses

### 📊 Analytics & Reporting
- **Monthly Trend Analysis** - 12-month spending visualization
- **Category Breakdown** - Pie charts showing spending distribution
- **Spending Insights** - Month-over-month comparison with percentage changes
- **Budget Alerts** - Email notifications when budget threshold exceeded

### 🎨 UI/UX Enhancements
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- **Dark Mode Toggle** - Comfortable viewing in any lighting condition
- **Sidebar Navigation** - Easy access to all major features
- **Advanced Filtering** - Filter expenses by category, date range, amount
- **Search Functionality** - Quick search across all transactions

### 🔐 Security
- **JWT Authentication** - Access and refresh token implementation
- **Protected Routes** - Automatic redirection for unauthorized access
- **Token Refresh Mechanism** - Seamless token refresh for expired tokens
- **Password Validation** - Minimum 6 characters with confirmation
- **Global Error Handling** - Comprehensive error handling middleware

### ⚡ Performance Optimizations
- **API Client with Automatic Refresh** - Transparent token refresh on API calls
- **Lazy Loading** - Components load only when needed
- **Memoization** - Optimized re-renders using useCallback and useMemo
- **Database Indexing** - Faster queries with MongoDB indexes

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** (already set up in `.env`)
   ```
   PORT=8080
   MONGO_URI=mongodb://127.0.0.1:27017/financeDB
   JWT_SECRET=myverysecuresecret
   JWT_REFRESH_SECRET=myveryrefreshsecret
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** (already set up in `.env`)
   ```
   REACT_APP_API_URL=http://localhost:8080
   ```

4. **Start the application**
   ```bash
   npm start
   ```
   App opens at `http://localhost:3000`

---

## 📁 Project Structure

```
EXPENSE TRACKER/
├── backend/
│   ├── Controllers/
│   │   ├── AuthController.js      # Authentication logic
│   │   ├── ExpenseController.js   # Expense CRUD & analytics
│   │   └── BudgetController.js    # Budget management
│   ├── Models/
│   │   ├── User.js                # User schema with embedded expenses
│   │   ├── Expense.js             # Expense schema
│   │   └── db.js                  # Database connection
│   ├── Middlewares/
│   │   ├── Auth.js                # JWT verification
│   │   ├── AuthValidation.js      # Request validation with Joi
│   │   └── ErrorHandler.js        # Global error handling
│   ├── Routes/
│   │   ├── AuthRouter.js          # Auth endpoints
│   │   ├── ExpenseRouter.js       # Expense endpoints
│   │   └── BudgetRouter.js        # Budget endpoints
│   ├── index.js                   # Express app setup
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── apiClient.js       # API client with token refresh
│   │   ├── components/
│   │   │   ├── Sidebar.jsx        # Navigation sidebar
│   │   │   ├── SummaryCards.jsx   # Dashboard summary cards
│   │   │   ├── AnalyticsDashboard.jsx  # Analytics charts
│   │   │   ├── ExpenseChart.jsx   # Pie chart for expenses
│   │   │   └── ProtectedRoute.jsx # Route protection
│   │   ├── hooks/
│   │   │   └── useAuth.js         # Custom auth hook
│   │   ├── pages/
│   │   │   ├── Login.js           # Login page
│   │   │   ├── Signup.js          # Signup page
│   │   │   ├── Home.js            # Main dashboard
│   │   │   ├── ExpenseForm.js     # Add expense form
│   │   │   ├── ExpenseTable.js    # Transaction list
│   │   │   └── ExpenseDetails.js  # Summary cards
│   │   ├── App.js                 # Route configuration
│   │   ├── utils.js               # Utility functions
│   │   └── index.js               # React entry point
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register new user |
| POST | `/auth/login` | Login user |
| POST | `/auth/refresh` | Refresh access token |
| GET | `/auth/me` | Get current user profile |
| POST | `/auth/logout` | Logout user |

### Expenses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/expenses` | Get all expenses (supports filters) |
| POST | `/expenses` | Create new expense |
| PUT | `/expenses/:id` | Update expense |
| DELETE | `/expenses/:id` | Delete expense |
| GET | `/expenses/export/csv` | Export expenses as CSV |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/expenses/analytics` | Get analytics overview |
| GET | `/expenses/analytics/monthly-trend` | Get 12-month spending trend |
| GET | `/expenses/analytics/category-breakdown` | Get category-wise breakdown |
| GET | `/expenses/analytics/insights` | Get spending insights |

### Budget
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/budget` | Get user budget |
| PUT | `/budget` | Update budget and threshold |

---

## 🧪 Testing

### Login Credentials
```
Email: testuser@example.com
Password: password123
```

### API Testing with curl
```bash
# Login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Add Expense (replace TOKEN with actual token)
curl -X POST http://localhost:8080/expenses \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"Groceries","amount":500,"category":"Food"}'

# Get all expenses
curl -X GET http://localhost:8080/expenses \
  -H "Authorization: Bearer TOKEN"
```

---

## 🎯 Features Documentation

### Dark Mode
Click the moon/sun icon in the sidebar to toggle dark mode. Preference is saved to localStorage.

### Budget Alerts
1. Set your monthly budget in the Budget tab
2. When spending exceeds 90% (configurable), an email alert is sent
3. Visual progress bar shows budget usage

### Analytics Dashboard
- **Monthly Trend** - Line chart showing last 12 months of spending
- **Category Breakdown** - Pie chart showing expense distribution
- **Spending Insights** - Month-over-month comparison with trends

### Filter Transactions
1. Go to Transactions tab
2. Filter by category, date range
3. Search by description
4. Results update in real-time

---

## 🔧 Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Joi** - Data validation

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Recharts** - Charts and graphs
- **React Icons** - Icon library
- **React Toastify** - Notifications

---

## 📈 Performance Optimizations

1. **Token Refresh** - Automatic token refresh prevents session expiration
2. **API Client** - Centralized API calls with error handling
3. **Component Memoization** - useCallback and useMemo prevent unnecessary re-renders
4. **Database Indexing** - Indexes on frequently queried fields
5. **Responsive Images** - Optimized for all screen sizes
6. **Lazy Loading** - Components load on demand

---

## 🔒 Security Features

✅ JWT authentication with access & refresh tokens
✅ Password hashing with bcrypt (12 salt rounds)
✅ CORS enabled for frontend
✅ Request validation with Joi schemas
✅ Protected API routes
✅ Global error handling
✅ SQL injection protection (using Mongoose)
✅ XSS protection (React escapes content by default)

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Solution: Ensure MongoDB is running
Windows: mongod
macOS: brew services start mongodb-community
Linux: sudo service mongod start
```

### CORS Error
```
Solution: Ensure FRONTEND_URL in backend .env matches your frontend URL
```

### Token Expired Error
```
Solution: Refresh token endpoint (/auth/refresh) is called automatically
If manual refresh needed: POST /auth/refresh with refresh token in body
```

### Module Not Found
```
Solution: npm install in both backend and frontend directories
```

---

## 🚀 Deployment

### Backend (Heroku)
```bash
heroku create your-app-name
git push heroku main
```

### Frontend (Vercel)
```bash
npm run build
vercel
```

---

## 📝 Future Enhancements

- [ ] Multi-currency support
- [ ] Bill splitting between users
- [ ] Recurring expense automation
- [ ] Mobile app with React Native
- [ ] AI-powered spending recommendations
- [ ] Social sharing features
- [ ] Bank account integration
- [ ] Multi-language support

---

## 📧 Support

For issues or questions, please create an issue on GitHub or contact the development team.

---

## 📄 License

This project is open source and available under the MIT License.

---

**Happy Expense Tracking! 🎉**
