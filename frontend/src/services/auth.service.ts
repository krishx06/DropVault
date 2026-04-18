import api from './api'
import type { User, UserRole } from '../types/user.types'

interface AuthData {
  token: string
  user: User
}

interface AuthResponse {
  success: boolean
  data: AuthData
}

export const login = (email: string, password: string) =>
  api.post<AuthResponse>('/auth/login', { email, password })

export const register = (name: string, email: string, password: string, role: UserRole) =>
  api.post<AuthResponse>('/auth/register', { name, email, password, role })

export const getMe = () =>
  api.get<{ data: User }>('/auth/me')
