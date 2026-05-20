const TOKEN_KEY = 'gigflow_token'
const USER_KEY = 'gigflow_user'

export const setToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token)
export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY)
export const removeToken = (): void => localStorage.removeItem(TOKEN_KEY)

export const setUser = (user: object): void => localStorage.setItem(USER_KEY, JSON.stringify(user))
export const getUser = <T>(): T | null => {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}
export const removeUser = (): void => localStorage.removeItem(USER_KEY)

export const clearAuth = (): void => {
  removeToken()
  removeUser()
}
