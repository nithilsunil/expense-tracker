import prisma from '../utils/prisma.js';
import { BadRequestError, NotFoundError, ForbiddenError } from '../utils/errorHandler.js';

export const createExpense = async (req, res, next) => {
  try {
    const { amount, category, date, notes } = req.body;

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      return next(new BadRequestError('Please provide a valid expense amount greater than 0.'));
    }
    if (!category) {
      return next(new BadRequestError('Please specify an expense category.'));
    }
    if (!date) {
      return next(new BadRequestError('Please select a date for the transaction.'));
    }

    const expense = await prisma.expense.create({
      data: {
        amount: parseFloat(amount),
        category,
        date: new Date(date),
        notes: notes || '',
        userId: req.user.id
      }
    });

    res.status(251).json({
      status: 'success',
      data: { expense }
    });
  } catch (error) {
    next(error);
  }
};

export const getExpenses = async (req, res, next) => {
  try {
    const { search, category, startDate, endDate } = req.query;
    
    // Base filter conditions
    const filterConditions = {
      userId: req.user.id
    };

    // Category filter
    if (category && category !== 'All') {
      filterConditions.category = category;
    }

    // Search Notes Filter
    if (search && search.trim() !== '') {
      filterConditions.OR = [
        { notes: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Date Bounds Filter
    if (startDate || endDate) {
      filterConditions.date = {};
      if (startDate) {
        filterConditions.date.gte = new Date(startDate);
      }
      if (endDate) {
        // Set end date to end of day to include all expenses on that day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filterConditions.date.lte = end;
      }
    }

    const expenses = await prisma.expense.findMany({
      where: filterConditions,
      orderBy: {
        date: 'desc'
      }
    });

    res.status(200).json({
      status: 'success',
      results: expenses.length,
      data: { expenses }
    });
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, category, date, notes } = req.body;

    const expense = await prisma.expense.findUnique({
      where: { id }
    });

    if (!expense) {
      return next(new NotFoundError('No expense found with that ID.'));
    }

    if (expense.userId !== req.user.id) {
      return next(new ForbiddenError('You do not have permission to modify this resource.'));
    }

    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: {
        amount: amount ? parseFloat(amount) : expense.amount,
        category: category || expense.category,
        date: date ? new Date(date) : expense.date,
        notes: notes !== undefined ? notes : expense.notes
      }
    });

    res.status(200).json({
      status: 'success',
      data: { expense: updatedExpense }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    const expense = await prisma.expense.findUnique({
      where: { id }
    });

    if (!expense) {
      return next(new NotFoundError('No expense found with that ID.'));
    }

    if (expense.userId !== req.user.id) {
      return next(new ForbiddenError('You do not have permission to delete this resource.'));
    }

    await prisma.expense.delete({
      where: { id }
    });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 1. Total Lifetime Expenses sum
    const totalAgg = await prisma.expense.aggregate({
      where: { userId },
      _sum: { amount: true }
    });
    const totalExpenses = totalAgg._sum.amount || 0;

    // 2. Current Month's Spending
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const monthAgg = await prisma.expense.aggregate({
      where: {
        userId,
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      _sum: { amount: true }
    });
    const monthlySpending = monthAgg._sum.amount || 0;

    // 3. Category Breakdown grouping
    const categoryGroup = await prisma.expense.groupBy({
      by: ['category'],
      where: { userId },
      _sum: { amount: true }
    });

    const categoryBreakdown = categoryGroup.map(item => ({
      name: item.category,
      value: parseFloat((item._sum.amount || 0).toFixed(2))
    }));

    // 4. Trend Data: daily spending timeline over past 30 days
    // Fetch last 100 expenses (to capture trend)
    const recentExpenses = await prisma.expense.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
      take: 100
    });

    const trendMap = {};
    recentExpenses.forEach(e => {
      const dateString = new Date(e.date).toISOString().split('T')[0];
      trendMap[dateString] = (trendMap[dateString] || 0) + e.amount;
    });

    const trendData = Object.keys(trendMap)
      .sort((a, b) => new Date(a) - new Date(b))
      .slice(-7) // retrieve last 7 dates containing records
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

    res.status(200).json({
      status: 'success',
      data: {
        totalExpenses: parseFloat(totalExpenses.toFixed(2)),
        monthlySpending: parseFloat(monthlySpending.toFixed(2)),
        categoryBreakdown,
        trendData
      }
    });
  } catch (error) {
    next(error);
  }
};
