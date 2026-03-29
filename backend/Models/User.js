// backend/Models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Expense sub-schema
const expenseSchema = new Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    validate: {
      validator: (val) => val !== 0,
      message: "Expense amount cannot be zero",
    },
  },
  category: {
    type: String,
    default: "Others",
    enum: ["Food", "Travel", "Shopping", "Health", "Bills", "Salary", "Investment", "Others"],
  },
  paymentMethod: {
    type: String,
    enum: ["Cash", "Card", "UPI", "Bank Transfer", "Other"],
    default: "Other",
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  recurrenceInterval: {
    type: String,
    enum: ["daily", "weekly", "monthly", "yearly", null],
    default: null,
  },
  notes: {
    type: String,
    maxlength: 300,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Main User schema
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },

    // Expenses embedded
    expenses: [expenseSchema],

    // Budget details
    budget: {
      amount: { type: Number, default: 0 },
      period: { type: String, enum: ["monthly"], default: "monthly" },
      alertThresholdPercent: { type: Number, default: 90 },
    },
  },
  { timestamps: true }
);

// Index for faster queries on expenses (esp. by category/date)
UserSchema.index({ "expenses.category": 1, "expenses.createdAt": -1 });

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
