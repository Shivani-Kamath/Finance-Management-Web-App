const express = require('express');
const { getBudget, updateBudget } = require('../Controllers/BudgetController');
const ensureAuthenticated = require('../Middlewares/Auth');

const router = express.Router();

// ✅ Get current budget
router.get('/', ensureAuthenticated, getBudget);

// ✅ Update budget (amount + threshold)
router.put('/', ensureAuthenticated, updateBudget);

module.exports = router;
