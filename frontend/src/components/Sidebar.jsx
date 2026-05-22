import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, 
  ReceiptText, 
  LogOut, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Wallet,
  User
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Expenses', path: '/expenses', icon: ReceiptText },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <header className="flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/70 px-4 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/70 md:hidden sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-md shadow-brand-500/20">
            <Wallet size={20} />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">SpendWise</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed bottom-0 top-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200/80 bg-white/80 px-6 py-8 backdrop-blur-lg transition-transform duration-300 dark:border-slate-800/80 dark:bg-slate-900/80 md:sticky md:h-screen md:translate-x-0 ${
          isOpen ? 'translate-x-0 top-16 md:top-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Desktop Brand Logo */}
        <div className="hidden items-center gap-3 md:flex">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-lg shadow-brand-500/20">
            <Wallet size={24} />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-2xl font-black tracking-tight bg-gradient-to-r from-brand-600 to-indigo-500 bg-clip-text text-transparent dark:from-brand-400 dark:to-indigo-300">
              SpendWise
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Expense Tracker
            </span>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 hidden border-slate-200/80 dark:border-slate-800/80 md:block" />

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/10 dark:bg-brand-500 dark:shadow-brand-500/10'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
                  }`
                }
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Settings */}
        <div className="mt-auto space-y-4">
          {/* Light/Dark Toggle */}
          <button
            onClick={toggleTheme}
            className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
          >
            {theme === 'dark' ? (
              <>
                <Sun size={18} className="text-amber-500" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon size={18} className="text-slate-700" />
                <span>Dark Mode</span>
              </>
            )}
          </button>

          {/* User Profile Card */}
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/50">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <User size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-200">
                {user?.name || 'Guest User'}
              </p>
              <p className="truncate text-xs text-slate-400 dark:text-slate-500">
                {user?.email || 'guest@spendwise.com'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-rose-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-rose-400 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
