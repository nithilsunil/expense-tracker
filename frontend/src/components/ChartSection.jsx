import React from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const CATEGORY_COLORS = {
  Food: '#8b5cf6',         // Brand violet
  Travel: '#06b6d4',        // Cyan
  Shopping: '#f59e0b',      // Amber
  Bills: '#f43f5e',         // Rose
  Entertainment: '#10b981', // Emerald
  Others: '#64748b'         // Slate
};

const DEFAULT_COLORS = ['#8b5cf6', '#06b6d4', '#f59e0b', '#f43f5e', '#10b981', '#64748b'];

const ChartSection = ({ trendData = [], categoryData = [] }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Custom tooltips to match our premium UI aesthetics
  const CustomAreaTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">{payload[0].payload.date}</p>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Total: <span className="text-brand-600 dark:text-brand-400">${payload[0].value.toFixed(2)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">{payload[0].name}</p>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Amount: <span className="text-slate-900 dark:text-white">${payload[0].value.toFixed(2)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Spending Trend Area Chart */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900 md:col-span-2">
        <div className="mb-4">
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">Spending Trend</h3>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Daily transaction volumes over past active dates</p>
        </div>
        <div className="h-72 w-full">
          {trendData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-400">
              No transactions recorded yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                <XAxis 
                  dataKey="date" 
                  stroke={isDark ? '#64748b' : '#94a3b8'} 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke={isDark ? '#64748b' : '#94a3b8'} 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomAreaTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Category Distribution Pie Chart */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
        <div className="mb-4">
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">Category Split</h3>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Distribution of expenses by category</p>
        </div>
        <div className="relative flex h-72 flex-col items-center justify-center">
          {categoryData.length === 0 ? (
            <div className="text-sm font-semibold text-slate-400">
              No category metrics available
            </div>
          ) : (
            <>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={CATEGORY_COLORS[entry.name] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]} 
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Custom Legend */}
              <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs">
                {categoryData.slice(0, 4).map((entry, idx) => (
                  <div key={entry.name} className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
                    <span 
                      className="h-2.5 w-2.5 rounded-full" 
                      style={{ backgroundColor: CATEGORY_COLORS[entry.name] || DEFAULT_COLORS[idx % DEFAULT_COLORS.length] }} 
                    />
                    <span>{entry.name}</span>
                  </div>
                ))}
                {categoryData.length > 4 && (
                  <div className="text-slate-400 dark:text-slate-500 font-medium">
                    +{categoryData.length - 4} more
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
