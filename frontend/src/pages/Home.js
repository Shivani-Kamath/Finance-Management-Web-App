import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIUrl, handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import ExpenseTable from './ExpenseTable';
import ExpenseDetails from './ExpenseDetails';
import ExpenseForm from './ExpenseForm';
import ExpenseChart from '../components/ExpenseChart';


function Home() {
  const [loggedInUser, setLoggedInUser] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [incomeAmt, setIncomeAmt] = useState(0);
  const [expenseAmt, setExpenseAmt] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('User Logged out');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  useEffect(() => {
    const amounts = expenses.map(item => item.amount);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0);
    const exp = amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1;
    setIncomeAmt(income);
    setExpenseAmt(exp);
  }, [expenses]);

  const deleteExpens = async (id) => {
    try {
      const url = `${APIUrl}/expenses/${id}`;
      const headers = {
        headers: {
          'Authorization': localStorage.getItem('token')
        },
        method: 'DELETE'
      };
      const response = await fetch(url, headers);
      if (response.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      const result = await response.json();
      handleSuccess(result?.message);
      setExpenses(result.data);
    } catch (err) {
      handleError(err);
    }
  };

  const fetchExpenses = useCallback(async () => {
    try {
      const url = `${APIUrl}/expenses`;
      const headers = {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      };
      const response = await fetch(url, headers);
      if (response.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      const result = await response.json();
      setExpenses(result.data);
    } catch (err) {
      handleError(err);
    }
  }, [navigate]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addTransaction = async (data) => {
    try {
      const url = `${APIUrl}/expenses`;
      const headers = {
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
      };
      const response = await fetch(url, headers);
      if (response.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      const result = await response.json();
      handleSuccess(result?.message);
      setExpenses(result.data);
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {loggedInUser}</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <ExpenseDetails incomeAmt={incomeAmt} expenseAmt={expenseAmt} />

      {/* 📊 Chart Section */}
      <div className="bg-white shadow-md rounded-lg p-4 my-6">
        <h2 className="text-lg font-semibold mb-4">Spending by Category</h2>
        <ExpenseChart expenses={expenses} />
      </div>

      <ExpenseForm addTransaction={addTransaction} />
      <ExpenseTable expenses={expenses} deleteExpens={deleteExpens} />

      <ToastContainer />
    </div>
  );
}

export default Home;
