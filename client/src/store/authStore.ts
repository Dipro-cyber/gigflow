import { create } from 'zustand'
import { User } from '../types'
import { getToken, getUser, setToken, setUser, clearAuth } from '../utils/storage'

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: getToken(),
  user: getUser<User>(),
  isAuthenticated: !!getToken(),

  login: (token, user) => {
    setToken(token)
    setUser(user)
    set({ token, user, isAuthenticated: true })
  },

  logout: () => {
    clearAuth()
    set({ token: null, user: null, isAuthenticated: false })
  },
}))
