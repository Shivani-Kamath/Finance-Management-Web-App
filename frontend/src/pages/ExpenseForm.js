// import React, { useState } from 'react';
// import { handleError } from '../utils';

// function ExpenseForm({ addTransaction }) {
//   const [expenseInfo, setExpenseInfo] = useState({
//     amount: '',
//     text: '',
//     category: ''
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setExpenseInfo({ ...expenseInfo, [name]: value });
//   };

//   const addExpenses = (e) => {
//     e.preventDefault();
//     const { amount, text, category } = expenseInfo;
//     if (!amount || !text || !category) {
//       handleError('Please fill all expense details including category');
//       return;
//     }
//     addTransaction(expenseInfo);
//     setExpenseInfo({ amount: '', text: '', category: '' });
//   };

//   return (
//     <div className="max-w-md mx-auto mt-6 bg-white shadow-md rounded-xl p-6">
//       <h2 className="text-2xl font-semibold mb-4 text-gray-700 text-center">
//         Add New Expense
//       </h2>
//       <form onSubmit={addExpenses} className="space-y-4">
//         {/* Text Input */}
//         <div>
//           <label className="block text-gray-600 font-medium mb-1" htmlFor="text">
//             Expense Detail
//           </label>
//           <input
//             type="text"
//             name="text"
//             id="text"
//             value={expenseInfo.text}
//             onChange={handleChange}
//             placeholder="e.g. Grocery shopping"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//         </div>

//         {/* Amount Input */}
//         <div>
//           <label className="block text-gray-600 font-medium mb-1" htmlFor="amount">
//             Amount (₹)
//           </label>
//           <input
//             type="number"
//             name="amount"
//             id="amount"
//             value={expenseInfo.amount}
//             onChange={handleChange}
//             placeholder="e.g. 500"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//         </div>

//         {/* Category Select */}
//         <div>
//           <label className="block text-gray-600 font-medium mb-1" htmlFor="category">
//             Category
//           </label>
//           <select
//             name="category"
//             id="category"
//             value={expenseInfo.category}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           >
//             <option value="">Select Category</option>
//             <option value="Food">Food</option>
//             <option value="Travel">Travel</option>
//             <option value="Shopping">Shopping</option>
//             <option value="Bills">Bills</option>
//             <option value="Entertainment">Entertainment</option>
//             <option value="Other">Other</option>
//           </select>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all"
//         >
//           Add Expense
//         </button>
//       </form>
//     </div>
//   );
// }

// export default ExpenseForm;

import React, { useState } from 'react';
import { handleError } from '../utils';

const categories = ['Food', 'Transport', 'Health', 'Shopping', 'Utilities', 'Other'];

function ExpenseForm({ addTransaction }) {
  const [expenseInfo, setExpenseInfo] = useState({
    amount: '',
    text: '',
    category: '',
    isRecurring: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExpenseInfo({
      ...expenseInfo,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const addExpenses = (e) => {
    e.preventDefault();
    const { amount, text, category } = expenseInfo;
    if (!amount || !text || !category) {
      return handleError('All fields are required (except Recurring)');
    }
    addTransaction(expenseInfo);
    setExpenseInfo({ amount: '', text: '', category: '', isRecurring: false });
  };

  return (
    <div className="max-w-md mx-auto mt-6 bg-white shadow-md rounded-xl p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700 text-center">
        Add New Expense
      </h2>
      <form onSubmit={addExpenses} className="space-y-4">
        <div>
          <label className="block text-gray-600 mb-1" htmlFor="text">Description</label>
          <input
            type="text"
            name="text"
            value={expenseInfo.text}
            onChange={handleChange}
            placeholder="e.g. Electricity bill"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1" htmlFor="amount">Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={expenseInfo.amount}
            onChange={handleChange}
            placeholder="e.g. 1500"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1" htmlFor="category">Category</label>
          <select
            name="category"
            value={expenseInfo.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          >
            <option value="">--Select Category--</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isRecurring"
            checked={expenseInfo.isRecurring}
            onChange={handleChange}
          />
          <label htmlFor="isRecurring" className="text-gray-600">Recurring Monthly?</label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;
