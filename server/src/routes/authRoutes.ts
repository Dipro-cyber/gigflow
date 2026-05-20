import { Router } from 'express'
import { body } from 'express-validator'
import { register, login, getMe } from '../controllers/authController'
import { validate } from '../middleware/validate'
import { protect } from '../middleware/auth'

const router = Router()

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 characters'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['admin', 'sales_user']).withMessage('Role must be admin or sales_user'),
  ],
  validate,
  register
)

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
)

router.get('/me', protect, getMe)

export default router
