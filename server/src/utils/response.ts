import { Response } from 'express'
import { ApiSuccess, ApiError, ApiPaginated, PaginationMeta } from '../types'

export const sendSuccess = <T>(res: Response, data: T, message?: string, statusCode = 200): void => {
  const body: ApiSuccess<T> = { success: true, data, ...(message && { message }) }
  res.status(statusCode).json(body)
}

export const sendError = (res: Response, error: string, statusCode = 500): void => {
  const body: ApiError = { success: false, error, statusCode }
  res.status(statusCode).json(body)
}

export const sendPaginated = <T>(res: Response, data: T[], meta: PaginationMeta): void => {
  const body: ApiPaginated<T> = { success: true, data, meta }
  res.status(200).json(body)
}
