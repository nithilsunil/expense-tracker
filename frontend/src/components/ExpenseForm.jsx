import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Others'];

const ExpenseForm = ({ isOpen, onClose, onSubmit, expense = null }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        notes: expense.notes || ''
      });
    } else {
      setFormData({
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    }
    setErrors({});
  }, [expense, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when editing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }
    if (!formData.category) {
      newErrors.category = 'Please choose a category';
    }
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
      {/* Modal Card */}
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            {expense ? 'Edit Expense' : 'Add New Expense'}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Amount input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all dark:bg-slate-950 ${
                errors.amount
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'border-slate-200 dark:border-slate-800 focus:border-brand-500 dark:focus:border-brand-400'
              }`}
              required
            />
            {errors.amount && (
              <p className="mt-1 text-xs font-medium text-rose-500">{errors.amount}</p>
            )}
          </div>

          {/* Category selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all dark:border-slate-800 dark:bg-slate-950 focus:border-brand-500 dark:focus:border-brand-400"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all dark:border-slate-800 dark:bg-slate-950 focus:border-brand-500 dark:focus:border-brand-400"
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Starbucks coffee, grocery run, etc."
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all dark:border-slate-800 dark:bg-slate-950 focus:border-brand-500 dark:focus:border-brand-400 resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-500/10 hover:bg-brand-500 dark:bg-brand-500 dark:hover:bg-brand-400 transition-colors"
            >
              {expense ? 'Save Changes' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
