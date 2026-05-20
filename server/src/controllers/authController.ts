import { Request, Response, NextFunction } from 'express'
import User from '../models/User'
import { signToken } from '../utils/jwt'
import { sendSuccess, sendError } from '../utils/response'

// POST /api/auth/register
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, role } = req.body as {
      name: string
      email: string
      password: string
      role?: 'admin' | 'sales_user'
    }

    const existing = await User.findOne({ email })
    if (existing) {
      sendError(res, 'Email already registered', 409)
      return
    }

    const user = await User.create({ name, email, password, role: role ?? 'sales_user' })
    const token = signToken(user._id.toString(), user.role)

    sendSuccess(
      res,
      {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      },
      'Registration successful',
      201
    )
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/login
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string }

    // Explicitly select password (it's excluded by default)
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      sendError(res, 'Invalid credentials', 401)
      return
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      sendError(res, 'Invalid credentials', 401)
      return
    }

    const token = signToken(user._id.toString(), user.role)

    sendSuccess(res, {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/auth/me  (protected)
export const getMe = async (req: Request & { user?: { id: string } }, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id)
    if (!user) {
      sendError(res, 'User not found', 404)
      return
    }
    sendSuccess(res, { id: user._id, name: user.name, email: user.email, role: user.role })
  } catch (err) {
    next(err)
  }
}
