import api from './api'
import { AuthResponse, ApiSuccess } from '../types'

interface RegisterPayload {
  name: string
  email: string
  password: string
  role?: 'admin' | 'sales_user'
}

interface LoginPayload {
  email: string
  password: string
}

export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const { data } = await api.post<ApiSuccess<AuthResponse>>('/api/auth/register', payload)
  return data.data
}

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await api.post<ApiSuccess<AuthResponse>>('/api/auth/login', payload)
  return data.data
}
