import { Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'
import { sendError } from '../utils/response'
import { AuthRequest, UserRole } from '../types'

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    sendError(res, 'No token provided', 401)
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = verifyToken(token)
    req.user = { id: decoded.id, role: decoded.role }
    next()
  } catch {
    sendError(res, 'Invalid or expired token', 401)
  }
}

export const requireRole = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      sendError(res, 'Forbidden — insufficient permissions', 403)
      return
    }
    next()
  }
}
