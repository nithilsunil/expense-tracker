import React from 'react';
import { Search, RotateCcw, CalendarRange } from 'lucide-react';

const CATEGORIES = ['All', 'Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Others'];

const Filters = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    onFilterChange({
      search: '',
      category: 'All',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Search Notes Input */}
        <div className="relative">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
            Search Description
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
              <Search size={16} />
            </span>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Search coffee, rent..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl outline-none bg-transparent focus:border-brand-500 dark:focus:border-brand-400 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Filter by Category */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
            Category
          </label>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full px-4 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl outline-none bg-transparent focus:border-brand-500 dark:focus:border-brand-400 text-slate-900 dark:text-white"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="w-full px-4 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl outline-none bg-transparent focus:border-brand-500 dark:focus:border-brand-400 text-slate-900 dark:text-white"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="w-full px-4 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl outline-none bg-transparent focus:border-brand-500 dark:focus:border-brand-400 text-slate-900 dark:text-white"
          />
        </div>

        {/* Actions Button */}
        <div className="flex items-end">
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-250 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl transition-all"
          >
            <RotateCcw size={15} />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
