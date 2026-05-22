import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import DashboardCard from '../components/DashboardCard';
import ChartSection from '../components/ChartSection';
import ExpenseForm from '../components/ExpenseForm';
import { DollarSign, CalendarRange, Receipt, Plus, ArrowUpRight, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalExpenses: 0,
    monthlySpending: 0,
    categoryBreakdown: [],
    trendData: []
  });
  const [recentExpenses, setRecentExpenses] = useState([]);
  
  // UX states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [statsRes, expensesRes] = await Promise.all([
        api.get('/expenses/stats'),
        api.get('/expenses')
      ]);

      setStats(statsRes.data.data);
      setRecentExpenses(expensesRes.data.data.expenses.slice(0, 5));
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Could not sync with the database. Please verify your connection.');
      triggerToast('Sync failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddExpenseSubmit = async (expenseData) => {
    try {
      await api.post('/expenses', expenseData);
      triggerToast('Expense recorded successfully!');
      fetchDashboardData(); // Refresh graphs and statistics
    } catch (err) {
      console.error('Error recording expense:', err);
      triggerToast(err.response?.data?.message || 'Failed to add expense.', 'error');
    }
  };

  if (loading && recentExpenses.length === 0) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Header skeleton */}
        <div className="h-14 w-1/3 rounded-xl bg-slate-200 dark:bg-slate-800" />
        
        {/* Cards skeleton */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>

        {/* Charts skeleton */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800 md:col-span-2" />
          <div className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
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

      {/* Welcome Title Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Hello, {user?.name || 'User'} 👋
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Here's a detailed summary of your current spending metrics
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

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm font-semibold text-rose-600 dark:text-rose-400">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Numerical Highlight Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Total Expenses"
          value={`$${stats.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          description="Cumulative tracking amount"
          trend="Lifetime"
          trendType="neutral"
        />
        <DashboardCard
          title="Monthly Spending"
          value={`$${stats.monthlySpending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={CalendarRange}
          description="For the current calendar month"
          trend="Real-time"
          trendType="neutral"
        />
        <DashboardCard
          title="Total Transactions"
          value={recentExpenses.length.toString()}
          icon={Receipt}
          description="Last updated timeline count"
          trend="Active"
          trendType="neutral"
        />
      </div>

      {/* Recharts Analytics Section */}
      <ChartSection 
        trendData={stats.trendData} 
        categoryData={stats.categoryBreakdown} 
      />

      {/* Recent Transactions List */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Your last 5 logged expenses</p>
          </div>
          <Link
            to="/expenses"
            className="flex items-center gap-1 text-sm font-bold text-brand-600 hover:text-brand-500 dark:text-brand-450 dark:hover:text-brand-350"
          >
            <span>View All</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-850">
          {recentExpenses.length === 0 ? (
            <div className="py-8 text-center text-sm font-semibold text-slate-400">
              No transactions recorded yet. Click Add Expense to start tracking.
            </div>
          ) : (
            recentExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-950 font-display text-sm font-bold text-slate-600 dark:text-slate-350 border border-slate-100 dark:border-slate-800">
                    {expense.category.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-200">
                      {expense.notes || <span className="italic font-normal text-slate-400">No notes</span>}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {expense.category} • {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <span className="font-display text-sm font-bold text-slate-900 dark:text-white">
                  -${expense.amount.toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Expense Modal Form */}
      <ExpenseForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddExpenseSubmit}
      />
    </div>
  );
};

export default Dashboard;
