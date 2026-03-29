const express = require('express');
const {
  getAllTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  exportTransactionsCSV,
  getAnalytics,
  getMonthlyTrend,
  getCategoryBreakdown,
  getSpendingInsights,
} = require('../Controllers/ExpenseController');

const router = express.Router();

// ✅ Analytics endpoints
router.get('/analytics', getAnalytics);
router.get('/analytics/monthly-trend', getMonthlyTrend);
router.get('/analytics/category-breakdown', getCategoryBreakdown);
router.get('/analytics/insights', getSpendingInsights);

// ✅ Get all expenses (with optional filters: category, startDate, endDate)
router.get('/', getAllTransactions);

// ✅ Add a new expense
router.post('/', addTransaction);

// ✅ Update an expense by ID
router.put('/:expenseId', updateTransaction);

// ✅ Delete an expense by ID
router.delete('/:expenseId', deleteTransaction);

// ✅ Export all expenses as CSV
router.get('/export/csv', exportTransactionsCSV);

module.exports = router;
