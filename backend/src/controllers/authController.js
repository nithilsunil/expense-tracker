import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';
import { BadRequestError, UnauthorizedError } from '../utils/errorHandler.js';

// Generate JWT signed token
const signToken = (id) => {
  return jwt.sign(
    { id }, 
    process.env.JWT_SECRET || 'spendwise_super_secret_local_dev_token_key', 
    { expiresIn: '30d' }
  );
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(new BadRequestError('Please provide name, email, and password.'));
    }

    if (password.length < 6) {
      return next(new BadRequestError('Password must be at least 6 characters.'));
    }

    // Normalizing email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      return next(new BadRequestError('An account with this email address already exists.'));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const newUser = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword
      }
    });

    // Sign JWT
    const token = signToken(newUser.id);

    // Expose User details without password
    res.status(251).json({
      status: 'success',
      token,
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new BadRequestError('Please provide email and password.'));
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new UnauthorizedError('Incorrect email or password.'));
    }

    // Sign JWT
    const token = signToken(user.id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
