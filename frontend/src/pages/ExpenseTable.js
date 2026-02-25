import React from 'react';
import { FaTrash, FaRedo } from 'react-icons/fa';

const ExpenseTable = ({ expenses, deleteExpens }) => {
  return (
    <div className="mt-6 space-y-4">
      {expenses.length === 0 ? (
        <p className="text-center text-gray-500">No expenses added yet.</p>
      ) : (
        expenses.map((expense, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-all"
          >
            <div className="flex flex-col">
              <p className="text-gray-800 font-medium">{expense.text}</p>
              <p className="text-sm text-gray-500">
                Category: {expense.category || 'N/A'}
              </p>

              {expense.isRecurring && (
                <span className="inline-flex items-center gap-1 text-xs bg-yellow-300 text-yellow-900 px-2 py-0.5 rounded mt-1 w-fit">
                  <FaRedo className="text-yellow-700" /> Recurring
                </span>
              )}
            </div>

            <div className="text-right">
              <p
                className={`text-lg font-bold ${
                  expense.amount > 0 ? 'text-green-600' : 'text-red-500'
                }`}
              >
                ₹{expense.amount}
              </p>
              <button
                onClick={() => deleteExpens(expense._id)}
                className="text-red-500 hover:text-red-700 transition-colors mt-2"
                title="Delete"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ExpenseTable;
