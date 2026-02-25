import React from 'react';

function ExpenseDetails({ incomeAmt, expenseAmt }) {
  const balance = incomeAmt - expenseAmt;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
      {/* Balance Card */}
      <div className="bg-white shadow-md rounded-2xl p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-700">Your Balance</h2>
        <p className="text-3xl font-bold text-green-600 mt-2">₹ {balance}</p>
      </div>

      {/* Income Card */}
      <div className="bg-green-50 border-l-4 border-green-500 shadow-md rounded-2xl p-6 text-center">
        <h2 className="text-lg font-semibold text-green-700">Income</h2>
        <p className="text-2xl font-bold text-green-600 mt-1">₹ {incomeAmt}</p>
      </div>

      {/* Expense Card */}
      <div className="bg-red-50 border-l-4 border-red-500 shadow-md rounded-2xl p-6 text-center">
        <h2 className="text-lg font-semibold text-red-700">Expense</h2>
        <p className="text-2xl font-bold text-red-600 mt-1">₹ {expenseAmt}</p>
      </div>
    </div>
  );
}

export default ExpenseDetails;
