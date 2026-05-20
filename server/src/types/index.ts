import { Types } from 'mongoose'
import { Request } from 'express'

// ─── User ────────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'sales_user'

export interface IUser {
  _id: Types.ObjectId
  name: string
  email: string
  password: string // hashed
  role: UserRole
  createdAt: Date
}

// ─── Lead ────────────────────────────────────────────────────────────────────

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost'
export type LeadSource = 'Website' | 'Instagram' | 'Referral'

export interface ILead {
  _id: Types.ObjectId
  name: string
  email: string
  status: LeadStatus
  source: LeadSource
  createdAt: Date
  createdBy: Types.ObjectId
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true
  data: T
  message?: string
}

export interface ApiError {
  success: false
  error: string
  statusCode: number
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiPaginated<T> {
  success: true
  data: T[]
  meta: PaginationMeta
}

// ─── Auth Request ─────────────────────────────────────────────────────────────

export interface AuthRequest extends Request {
  user?: {
    id: string
    role: UserRole
  }
}

// ─── JWT Payload ──────────────────────────────────────────────────────────────

export interface JwtPayload {
  id: string
  role: UserRole
}
