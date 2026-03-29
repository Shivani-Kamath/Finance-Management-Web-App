// controllers/ExpenseController.js

const Expense = require('../Models/Expense');
const User = require('../Models/User');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const { Parser } = require('json2csv');

// ================= Nodemailer Config ==================
const transporter = nodemailer.createTransport({
  host: process.env.ALERT_EMAIL_HOST,
  port: process.env.ALERT_EMAIL_PORT,
  secure: process.env.ALERT_EMAIL_PORT == 465, // true for 465
  auth: {
    user: process.env.ALERT_EMAIL_USER,
    pass: process.env.ALERT_EMAIL_PASS,
  },
});

// ================= Helper Functions ==================
async function getMonthlyTotal(userId) {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const result = await Expense.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), createdAt: { $gte: first, $lt: last } } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  return (result[0] && result[0].total) ? result[0].total : 0;
}

async function sendBudgetAlert(userEmail, userName, budget, total) {
  const percent = Math.round((total / budget) * 100);
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: userEmail,
    subject: `Budget Alert: ${percent}% of monthly budget used`,
    text: `Hi ${userName || ''},\n\nYou've used ${percent}% of your monthly budget (${total} / ${budget}). Consider reviewing your recent expenses.\n\nRegards,\nExpense Tracker`
  };
  await transporter.sendMail(mailOptions);
}

// ================= Controllers ==================
async function addTransaction(req, res) {
  try {
    const userId = req.user.id || req.user._id;
    const { text, amount, category, isRecurring, createdAt } = req.body;

    if (!text || !amount) {
      return res.status(400).json({
        message: "Please provide both text and amount",
        success: false,
      });
    }

    const expense = new Expense({
      user: userId,
      text,
      amount,
      category: category || "Other",
      isRecurring: isRecurring || false,
      createdAt: createdAt ? new Date(createdAt) : new Date(),
    });

    await expense.save();

    // check budget alert
    const user = await User.findById(userId);
    if (user && user.budget && user.budget.amount > 0) {
      const total = await getMonthlyTotal(userId);
      const budget = user.budget.amount;
      const thresholdPercent = user.budget.alertThresholdPercent || 90;
      const percentUsed = (total / budget) * 100;

      if (percentUsed >= thresholdPercent) {
        try {
          await sendBudgetAlert(user.email, user.name, budget, total);
          console.log('Budget alert sent to', user.email);
        } catch (emailErr) {
          console.error('Error sending budget alert', emailErr);
        }
      }
    }

    res.status(200).json({
      message: "Expense added successfully",
      success: true,
      data: expense,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
}

async function getAllTransactions(req, res) {
  try {
    const userId = req.user.id || req.user._id;
    const { category, startDate, endDate } = req.query;

    let filters = { user: userId };
    if (category) filters.category = category;
    if (startDate && endDate) {
      filters.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const expenses = await Expense.find(filters).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Fetched expenses successfully",
      success: true,
      data: expenses,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Something went wrong",
      error: err.message,
      success: false,
    });
  }
}

async function updateTransaction(req, res) {
  try {
    const userId = req.user.id || req.user._id;
    const expenseId = req.params.expenseId;

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: expenseId, user: userId },
      req.body,
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({
        message: "Expense not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Expense updated successfully",
      success: true,
      data: updatedExpense,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", success: false });
  }
}

async function deleteTransaction(req, res) {
  try {
    const userId = req.user.id || req.user._id;
    const expenseId = req.params.expenseId;

    await Expense.deleteOne({ _id: expenseId, user: userId });
    const expenses = await Expense.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Expense deleted successfully",
      success: true,
      data: expenses,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Something went wrong",
      error: err.message,
      success: false,
    });
  }
}

async function exportTransactionsCSV(req, res) {
  try {
    const userId = req.user.id || req.user._id;
    const expenses = await Expense.find({ user: userId }).sort({ createdAt: -1 });

    const fields = ['text', 'amount', 'category', 'isRecurring', 'createdAt'];
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(expenses);

    res.header('Content-Type', 'text/csv');
    res.attachment('transactions.csv');
    return res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error exporting CSV", success: false });
  }
}

// ================= Analytics Functions ==================

/**
 * Get Monthly Trend - shows total spending for last 12 months
 */
async function getMonthlyTrend(req, res) {
  try {
    const userId = req.user.id || req.user._id;
    const months = 12;
    const data = [];

    for (let i = months - 1; i >= 0; i--) {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - i);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      const result = await Expense.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            date: { $gte: startDate, $lt: endDate },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      const total = result[0]?.total || 0;
      data.push({
        month: startDate.toLocaleString("default", { 
          month: "short", 
          year: "2-digit" 
        }),
        amount: Math.round(total * 100) / 100,
      });
    }

    res.status(200).json({
      success: true,
      message: "Monthly trend fetched",
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching monthly trend",
      success: false,
    });
  }
}

/**
 * Get Category Breakdown - spending by category for current month
 */
async function getCategoryBreakdown(req, res) {
  try {
    const userId = req.user.id || req.user._id;
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const result = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: first, $lt: last },
        },
      },
      {
        $group: {
          _id: "$category",
          amount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { amount: -1 } },
    ]);

    const data = result.map((item) => ({
      category: item._id || "Uncategorized",
      amount: Math.round(item.amount * 100) / 100,
      count: item.count,
    }));

    res.status(200).json({
      success: true,
      message: "Category breakdown fetched",
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching category breakdown",
      success: false,
    });
  }
}

/**
 * Get Spending Insights - comparison with previous month, top categories, etc.
 */
async function getSpendingInsights(req, res) {
  try {
    const userId = req.user.id || req.user._id;
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);

    // Current month total
    const currentResult = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: currentMonthStart, $lt: currentMonthEnd },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Previous month total
    const previousResult = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: previousMonthStart, $lt: previousMonthEnd },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const currentTotal = currentResult[0]?.total || 0;
    const previousTotal = previousResult[0]?.total || 0;

    // Calculate percentage change
    let percentageChange = 0;
    if (previousTotal !== 0) {
      percentageChange = Math.round(
        (((currentTotal - previousTotal) / previousTotal) * 100)
      );
    } else if (currentTotal > 0) {
      percentageChange = 100;
    }

    // Get top 3 categories this month
    const topCategories = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: currentMonthStart, $lt: currentMonthEnd },
        },
      },
      {
        $group: {
          _id: "$category",
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { amount: -1 } },
      { $limit: 3 },
    ]);

    res.status(200).json({
      success: true,
      message: "Spending insights fetched",
      data: {
        currentMonthTotal: Math.round(currentTotal * 100) / 100,
        previousMonthTotal: Math.round(previousTotal * 100) / 100,
        percentageChange: percentageChange > 0 ? `+${percentageChange}%` : `${percentageChange}%`,
        changeIndicator: percentageChange > 0 ? "up" : percentageChange < 0 ? "down" : "same",
        topCategories: topCategories.map((item) => ({
          category: item._id || "Uncategorized",
          amount: Math.round(item.amount * 100) / 100,
        })),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching spending insights",
      success: false,
    });
  }
}

/**
 * Get all analytics - combined endpoint for dashboard
 */
async function getAnalytics(req, res) {
  try {
    const userId = req.user.id || req.user._id;

    // All required data in one call
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Current month expense total
    const monthlyTotal = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: currentMonthStart, $lt: currentMonthEnd },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Total transactions count
    const transactionCount = await Expense.countDocuments({ user: userId });

    // Average transaction
    const avgResult = await Expense.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          avgAmount: { $avg: "$amount" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Analytics fetched successfully",
      data: {
        monthlyTotal: Math.round((monthlyTotal[0]?.total || 0) * 100) / 100,
        totalTransactions: transactionCount,
        averageTransaction: Math.round((avgResult[0]?.avgAmount || 0) * 100) / 100,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching analytics",
      success: false,
    });
  }
}

module.exports = {
  addTransaction,
  getAllTransactions,
  updateTransaction,
  deleteTransaction,
  exportTransactionsCSV,
  getAnalytics,
  getMonthlyTrend,
  getCategoryBreakdown,
  getSpendingInsights,
};
