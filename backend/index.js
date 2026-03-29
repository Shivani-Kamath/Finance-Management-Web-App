require('dotenv').config();

const express = require('express');
const cors = require('cors');

const AuthRouter = require('./Routes/AuthRouter');
const ExpenseRouter = require('./Routes/ExpenseRouter');
const BudgetRouter = require('./Routes/BudgetRouter');
const ensureAuthenticated = require('./Middlewares/Auth');
const errorHandler = require('./Middlewares/ErrorHandler');

require('./Models/db'); // DB connection

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Middleware
app.use(express.json()); // replaces body-parser
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Health check
app.get('/ping', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// ✅ Routes
app.use('/auth', AuthRouter);
app.use('/expenses', ensureAuthenticated, ExpenseRouter);
app.use('/budget', ensureAuthenticated, BudgetRouter);

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// ✅ Global Error Handler (must be last middleware)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}`);
});

