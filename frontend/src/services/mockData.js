const INITIAL_EXPENSES = [
  {
    id: 'exp-1',
    amount: 12.50,
    category: 'Food',
    date: '2026-05-20',
    notes: 'Starbucks Coffee with teammate',
    createdAt: new Date('2026-05-20T08:30:00Z').toISOString()
  },
  {
    id: 'exp-2',
    amount: 1200.00,
    category: 'Bills',
    date: '2026-05-01',
    notes: 'Monthly apartment rent',
    createdAt: new Date('2026-05-01T10:00:00Z').toISOString()
  },
  {
    id: 'exp-3',
    amount: 45.30,
    category: 'Travel',
    date: '2026-05-18',
    notes: 'Uber ride to client office',
    createdAt: new Date('2026-05-18T14:20:00Z').toISOString()
  },
  {
    id: 'exp-4',
    amount: 89.99,
    category: 'Shopping',
    date: '2026-05-15',
    notes: 'Wireless ergonomic mouse',
    createdAt: new Date('2026-05-15T11:45:00Z').toISOString()
  },
  {
    id: 'exp-5',
    amount: 15.99,
    category: 'Bills',
    date: '2026-05-10',
    notes: 'Netflix subscription',
    createdAt: new Date('2026-05-10T19:00:00Z').toISOString()
  },
  {
    id: 'exp-6',
    amount: 65.00,
    category: 'Entertainment',
    date: '2026-05-22',
    notes: 'Concert ticket with friends',
    createdAt: new Date('2026-05-22T21:00:00Z').toISOString()
  },
  {
    id: 'exp-7',
    amount: 35.80,
    category: 'Food',
    date: '2026-05-21',
    notes: 'Weekly organic groceries purchase',
    createdAt: new Date('2026-05-21T17:15:00Z').toISOString()
  },
  {
    id: 'exp-8',
    amount: 50.00,
    category: 'Others',
    date: '2026-05-12',
    notes: 'Birthday gift for colleague',
    createdAt: new Date('2026-05-12T13:00:00Z').toISOString()
  }
];

export const getMockExpenses = () => {
  const data = localStorage.getItem('mock_expenses');
  if (!data) {
    localStorage.setItem('mock_expenses', JSON.stringify(INITIAL_EXPENSES));
    return INITIAL_EXPENSES;
  }
  return JSON.parse(data);
};

export const saveMockExpenses = (expenses) => {
  localStorage.setItem('mock_expenses', JSON.stringify(expenses));
};

export const addMockExpense = (expenseData) => {
  const expenses = getMockExpenses();
  const newExpense = {
    id: `exp-${Date.now()}`,
    amount: parseFloat(expenseData.amount),
    category: expenseData.category,
    date: expenseData.date,
    notes: expenseData.notes || '',
    createdAt: new Date().toISOString()
  };
  expenses.unshift(newExpense); // add to top
  saveMockExpenses(expenses);
  return newExpense;
};

export const updateMockExpense = (id, expenseData) => {
  const expenses = getMockExpenses();
  const index = expenses.findIndex(e => e.id === id);
  if (index === -1) throw new Error('Expense not found');
  
  expenses[index] = {
    ...expenses[index],
    amount: parseFloat(expenseData.amount),
    category: expenseData.category,
    date: expenseData.date,
    notes: expenseData.notes || '',
    updatedAt: new Date().toISOString()
  };
  saveMockExpenses(expenses);
  return expenses[index];
};

export const deleteMockExpense = (id) => {
  const expenses = getMockExpenses();
  const filtered = expenses.filter(e => e.id !== id);
  saveMockExpenses(filtered);
  return true;
};

export const getMockStats = () => {
  const expenses = getMockExpenses();
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  
  // Calculate current month's spending
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed
  
  const monthlySpending = expenses
    .filter(e => {
      const eDate = new Date(e.date);
      return eDate.getFullYear() === currentYear && eDate.getMonth() === currentMonth;
    })
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Category breakdown
  const categoryMap = {};
  expenses.forEach(e => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });

  const categoryBreakdown = Object.keys(categoryMap).map(cat => ({
    name: cat,
    value: parseFloat(categoryMap[cat].toFixed(2))
  }));

  // Daily trends for the last 7 days with expenses
  const trendMap = {};
  expenses.forEach(e => {
    trendMap[e.date] = (trendMap[e.date] || 0) + e.amount;
  });
  
  const trendData = Object.keys(trendMap)
    .sort((a, b) => new Date(a) - new Date(b))
    .slice(-7) // last 7 points
    .map(date => {
      const formattedDate = new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      return {
        date: formattedDate,
        amount: parseFloat(trendMap[date].toFixed(2))
      };
    });

  return {
    totalExpenses: parseFloat(totalExpenses.toFixed(2)),
    monthlySpending: parseFloat(monthlySpending.toFixed(2)),
    categoryBreakdown,
    trendData
  };
};
