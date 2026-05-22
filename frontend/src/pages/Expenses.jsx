import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import Filters from '../components/Filters';
import ExpenseList from '../components/ExpenseList';
import ExpenseForm from '../components/ExpenseForm';
import { Plus, Loader2, AlertCircle } from 'lucide-react';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  
  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    startDate: '',
    endDate: ''
  });

  // UX states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Fetch expenses with active filter state
  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      // Clean query parameters to match backend specs
      const params = {};
      if (filters.search.trim()) params.search = filters.search.trim();
      if (filters.category !== 'All') params.category = filters.category;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await api.get('/expenses', { params });
      setExpenses(response.data.data.expenses);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError('Could not load transactions. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    // Debounce search slightly to avoid hammering the database
    const handler = setTimeout(() => {
      fetchExpenses();
    }, 300);

    return () => clearTimeout(handler);
  }, [fetchExpenses]);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingExpense) {
        await api.patch(`/expenses/${editingExpense.id}`, formData);
        triggerToast('Expense updated successfully!');
      } else {
        await api.post('/expenses', formData);
        triggerToast('Expense added successfully!');
      }
      fetchExpenses();
      setEditingExpense(null);
    } catch (err) {
      console.error('Error saving expense:', err);
      triggerToast(err.response?.data?.message || 'Failed to save expense.', 'error');
    }
  };

  const handleEditClick = (expense) => {
    // Format date string to match native HTML date picker format YYYY-MM-DD
    const formattedDate = new Date(expense.date).toISOString().split('T')[0];
    setEditingExpense({
      ...expense,
      date: formattedDate
    });
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await api.delete(`/expenses/${id}`);
        triggerToast('Expense deleted successfully.');
        fetchExpenses();
      } catch (err) {
        console.error('Error deleting expense:', err);
        triggerToast('Failed to delete expense.', 'error');
      }
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingExpense(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Alert Pop-up */}
      {toast.show && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-2xl px-5 py-3.5 shadow-xl transition-all duration-300 border text-sm font-semibold text-white ${
          toast.type === 'error' 
            ? 'bg-rose-600 border-rose-500' 
            : 'bg-emerald-600 border-emerald-500'
        }`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Expenses Log
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Manage, filter, and review all of your individual expense items
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-500/10 hover:bg-brand-500 dark:bg-brand-500 dark:hover:bg-brand-400 transition-all self-start sm:self-auto"
        >
          <Plus size={18} />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Filters Dashboard Box */}
      <Filters filters={filters} onFilterChange={setFilters} />

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm font-semibold text-rose-600 dark:text-rose-400">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Expense List Table/Card Grid */}
      {loading && expenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900">
          <Loader2 size={32} className="animate-spin text-brand-600 dark:text-brand-500 mb-3" />
          <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">Querying database...</p>
        </div>
      ) : (
        <ExpenseList 
          expenses={expenses} 
          onEdit={handleEditClick} 
          onDelete={handleDeleteClick} 
        />
      )}

      {/* Add / Edit Expense Popup Modal */}
      <ExpenseForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleCreateOrUpdate}
        expense={editingExpense}
      />
    </div>
  );
};

export default Expenses;
