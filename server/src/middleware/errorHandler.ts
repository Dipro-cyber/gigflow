import { Request, Response, NextFunction } from 'express'
import { sendError } from '../utils/response'

interface AppError extends Error {
  statusCode?: number
  code?: number
}

// Centralized error handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction): void => {
  let statusCode = err.statusCode ?? 500
  let message = err.message ?? 'Internal Server Error'

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409
    message = 'A record with that value already exists'
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400
    message = err.message
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token'
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expired'
  }

  sendError(res, message, statusCode)
}

export const notFound = (req: Request, res: Response): void => {
  sendError(res, `Route ${req.originalUrl} not found`, 404)
}
