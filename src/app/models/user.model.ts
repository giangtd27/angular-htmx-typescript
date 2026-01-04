export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user'
}

export enum DialogType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete'
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

export interface User {
  id: number
  email: string
  name: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface PasswordUpdate {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
