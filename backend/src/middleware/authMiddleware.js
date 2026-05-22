import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';
import { UnauthorizedError } from '../utils/errorHandler.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for authorization headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new UnauthorizedError('Please log in to access this resource.'));
    }

    // Verify token validity
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'spendwise_super_secret_local_dev_token_key');

    // Check if user still exists
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!currentUser) {
      return next(new UnauthorizedError('The user belonging to this token no longer exists.'));
    }

    // Expose authenticated user context to request
    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new UnauthorizedError('Invalid token. Please log in again.'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Your token has expired. Please log in again.'));
    }
    next(error);
  }
};
