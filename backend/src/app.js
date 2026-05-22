import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import { globalErrorHandler, NotFoundError } from './utils/errorHandler.js';

const app = express();

// Standard middleware setup
app.use(cors({
  origin: '*', // In production, replace with specific frontend URL
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API route mount points
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'SpendWise Backend API is running smoothly.'
  });
});

// Fallback Route handler (404)
app.all('*', (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`));
});

// Global Error Handler Middleware
app.use(globalErrorHandler);

export default app;
