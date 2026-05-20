// ─── User ────────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'sales_user'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface AuthResponse {
  token: string
  user: User
}

// ─── Lead ────────────────────────────────────────────────────────────────────

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost'
export type LeadSource = 'Website' | 'Instagram' | 'Referral'

export interface Lead {
  _id: string
  name: string
  email: string
  status: LeadStatus
  source: LeadSource
  createdAt: string
  createdBy: { _id: string; name: string; email: string } | string
}

export interface CreateLeadPayload {
  name: string
  email: string
  status?: LeadStatus
  source: LeadSource
}

export interface UpdateLeadPayload {
  name?: string
  email?: string
  status?: LeadStatus
  source?: LeadSource
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

// ─── Filter / Query ───────────────────────────────────────────────────────────

export interface LeadFilters {
  status?: LeadStatus | ''
  source?: LeadSource | ''
  search?: string
  sort?: 'latest' | 'oldest'
  page?: number
}
