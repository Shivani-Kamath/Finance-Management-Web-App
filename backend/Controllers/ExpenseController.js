const UserModel = require("../Models/User");

const addTransaction = async (req, res) => {
  const { _id } = req.user;
  const { text, amount, category } = req.body;

  if (!text || !amount) {
    return res.status(400).json({
      message: "Please provide both text and amount",
      success: false,
    });
  }

  const newExpense = {
    text,
    amount,
    category: category || "Others",
    createdAt: new Date(),
  };

  try {
    const userData = await UserModel.findByIdAndUpdate(
      _id,
      { $push: { expenses: newExpense } },
      { new: true }
    );

    res.status(200).json({
      message: "Expense added successfully",
      success: true,
      data: userData?.expenses.reverse(), // latest first
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong",
      error: err.message,
      success: false,
    });
  }
};

const getAllTransactions = async (req, res) => {
  const { _id } = req.user;

  try {
    const userData = await UserModel.findById(_id).select("expenses");

    res.status(200).json({
      message: "Fetched expenses successfully",
      success: true,
      data: userData?.expenses.reverse(),
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong",
      error: err.message,
      success: false,
    });
  }
};

const deleteTransaction = async (req, res) => {
  const { _id } = req.user;
  const expenseId = req.params.expenseId;

  try {
    const userData = await UserModel.findByIdAndUpdate(
      _id,
      { $pull: { expenses: { _id: expenseId } } },
      { new: true }
    );

    res.status(200).json({
      message: "Expense deleted successfully",
      success: true,
      data: userData?.expenses.reverse(),
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong",
      error: err.message,
      success: false,
    });
  }
};

module.exports = {
  addTransaction,
  getAllTransactions,
  deleteTransaction,
};
