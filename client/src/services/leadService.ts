import api from './api'
import { Lead, CreateLeadPayload, UpdateLeadPayload, ApiSuccess, ApiPaginated, LeadFilters } from '../types'

export const getLeads = async (filters: LeadFilters): Promise<ApiPaginated<Lead>> => {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.source) params.set('source', filters.source)
  if (filters.search) params.set('search', filters.search)
  if (filters.sort) params.set('sort', filters.sort)
  if (filters.page) params.set('page', String(filters.page))

  const { data } = await api.get<ApiPaginated<Lead>>(`/api/leads?${params.toString()}`)
  return data
}

export const getLeadById = async (id: string): Promise<Lead> => {
  const { data } = await api.get<ApiSuccess<Lead>>(`/api/leads/${id}`)
  return data.data
}

export const createLead = async (payload: CreateLeadPayload): Promise<Lead> => {
  const { data } = await api.post<ApiSuccess<Lead>>('/api/leads', payload)
  return data.data
}

export const updateLead = async (id: string, payload: UpdateLeadPayload): Promise<Lead> => {
  const { data } = await api.put<ApiSuccess<Lead>>(`/api/leads/${id}`, payload)
  return data.data
}

export const deleteLead = async (id: string): Promise<void> => {
  await api.delete(`/api/leads/${id}`)
}

export const getExportUrl = (filters: LeadFilters): string => {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.source) params.set('source', filters.source)
  if (filters.search) params.set('search', filters.search)
  if (filters.sort) params.set('sort', filters.sort)
  return `${import.meta.env.VITE_API_URL ?? 'http://localhost:5000'}/api/leads/export/csv?${params.toString()}`
}
