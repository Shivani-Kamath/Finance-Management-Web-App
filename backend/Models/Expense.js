const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Expense description is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Expense amount is required"],
      validate: {
        validator: function (val) {
          return val !== 0; // prevent meaningless 0 entries
        },
        message: "Amount must be non-zero",
      },
    },
    category: {
      type: String,
      enum: [
        "Food",
        "Transport",
        "Health",
        "Shopping",
        "Utilities",
        "Entertainment",
        "Education",
        "Medical",
        "Rent",
        "Other",
      ],
      default: "Other",
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
    date: {
      type: Date,
      default: Date.now, // allows custom backdated entries
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// 🔹 Index for fast querying by user & date (important for dashboards/analytics)
ExpenseSchema.index({ user: 1, date: -1 });
ExpenseSchema.index({ category: 1 });

module.exports = mongoose.model("Expense", ExpenseSchema);
