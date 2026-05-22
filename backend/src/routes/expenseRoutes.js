import express from 'express';
import { 
  createExpense, 
  getExpenses, 
  updateExpense, 
  deleteExpense, 
  getDashboardStats 
} from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to protect all downstream routes
router.use(protect);

router.post('/', createExpense);
router.get('/', getExpenses);
router.get('/stats', getDashboardStats);
router.patch('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;
