const UserModel = require('../Models/User');

// ================= Get Budget =================
async function getBudget(req, res) {
  try {
    const userId = req.user.id || req.user._id;
    const user = await UserModel.findById(userId).select("budget");

    if (!user) return res.status(404).json({ success: false, msg: "User not found" });

    return res.json({
      success: true,
      budget: user.budget || { amount: 0, alertThresholdPercent: 90 }
    });
  } catch (err) {
    console.error("Error fetching budget:", err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
}

// ================= Update Budget =================
async function updateBudget(req, res) {
  const userId = req.user.id || req.user._id;
  const { amount, alertThresholdPercent } = req.body;

  try {
    if (amount != null && amount < 0) {
      return res.status(400).json({ success: false, msg: "Budget cannot be negative" });
    }

    if (alertThresholdPercent != null && (alertThresholdPercent < 1 || alertThresholdPercent > 100)) {
      return res.status(400).json({ success: false, msg: "Alert threshold must be between 1 and 100" });
    }

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, msg: "User not found" });

    user.budget.amount = amount != null ? amount : user.budget.amount;
    user.budget.alertThresholdPercent = alertThresholdPercent != null ? alertThresholdPercent : user.budget.alertThresholdPercent;
    await user.save();

    return res.json({
      success: true,
      msg: "Budget updated",
      budget: user.budget
    });
  } catch (err) {
    console.error("Error updating budget:", err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
}

module.exports = { getBudget, updateBudget };
