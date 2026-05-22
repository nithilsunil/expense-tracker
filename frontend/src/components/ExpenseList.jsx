import React from 'react';
import { Pencil, Trash2, Calendar, ClipboardList } from 'lucide-react';

const CATEGORY_STYLES = {
  Food: 'bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-850/30',
  Travel: 'bg-cyan-50 text-cyan-700 border-cyan-100 dark:bg-cyan-950/30 dark:text-cyan-400 dark:border-cyan-850/30',
  Shopping: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-850/30',
  Bills: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-850/30',
  Entertainment: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-850/30',
  Others: 'bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-800/60'
};

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  const getBadgeStyle = (category) => {
    return CATEGORY_STYLES[category] || CATEGORY_STYLES.Others;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 dark:bg-slate-950/60 dark:text-slate-500 mb-4">
          <ClipboardList size={28} />
        </div>
        <h4 className="font-display text-lg font-bold text-slate-800 dark:text-slate-200">No Expenses Recorded</h4>
        <p className="mt-1 text-center text-sm font-medium text-slate-400 dark:text-slate-500 max-w-xs">
          No transactions match your current search queries. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm text-slate-600 dark:text-slate-350">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50">
              <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Category</th>
              <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Notes / Details</th>
              <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Date</th>
              <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Amount</th>
              <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {expenses.map((expense) => (
              <tr 
                key={expense.id}
                className="group hover:bg-slate-50/40 dark:hover:bg-slate-800/10 transition-colors"
              >
                {/* Category badge column */}
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold tracking-wide shadow-sm ${getBadgeStyle(expense.category)}`}>
                    {expense.category}
                  </span>
                </td>
                
                {/* Notes column */}
                <td className="px-6 py-4">
                  <div className="max-w-[280px] sm:max-w-[400px] truncate text-slate-900 dark:text-slate-200 font-medium">
                    {expense.notes || <span className="text-slate-400 italic font-normal">No details provided</span>}
                  </div>
                </td>

                {/* Date column */}
                <td className="whitespace-nowrap px-6 py-4 text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    <span>{formatDate(expense.date)}</span>
                  </div>
                </td>

                {/* Amount column */}
                <td className="whitespace-nowrap px-6 py-4 text-slate-950 dark:text-white font-bold font-display text-base">
                  ${expense.amount.toFixed(2)}
                </td>

                {/* Actions column */}
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(expense)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-brand-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-brand-400 transition-colors"
                      title="Edit Expense"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(expense.id)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-rose-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-rose-450 transition-colors"
                      title="Delete Expense"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseList;
