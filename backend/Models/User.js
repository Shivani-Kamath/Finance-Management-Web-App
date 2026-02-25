const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    default: "Others", // Examples: Food, Travel, Bills, etc.
    enum: ["Food", "Travel", "Shopping", "Health", "Bills", "Salary", "Investment", "Others"]
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  expenses: [expenseSchema]
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
