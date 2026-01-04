import { Injectable, signal, computed } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, of, throwError } from 'rxjs'
import { delay, tap } from 'rxjs/operators'
import { User, UserRole, LoginCredentials, AuthResponse } from '../models/user.model'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token'
  private readonly USER_KEY = 'current_user'

  private currentUser = signal<User | null>(null)
  private isAuthenticated = signal<boolean>(false)

  public readonly user = this.currentUser.asReadonly()
  public readonly authenticated = this.isAuthenticated.asReadonly()
  public readonly isAdmin = computed(() => {
    const user = this.currentUser()
    if (!user) return false
    return user.role === UserRole.SUPERADMIN || user.role === UserRole.ADMIN
  })
  public readonly isSuperAdmin = computed(() => {
    const user = this.currentUser()
    if (!user) return false
    return user.role === UserRole.SUPERADMIN
  })

  constructor(private router: Router) {
    this.initializeAuth()
  }

  private initializeAuth(): void {
    const token = localStorage.getItem(this.TOKEN_KEY)
    const userStr = localStorage.getItem(this.USER_KEY)
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        this.currentUser.set(user)
        this.isAuthenticated.set(true)
      } catch {
        this.logout()
      }
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    // Mock authentication - replace with actual API call
    if (credentials.email === 'superadmin@example.com' && credentials.password === 'password') {
      const user: User = {
        id: 1,
        email: credentials.email,
        name: 'Super Admin',
        role: UserRole.SUPERADMIN,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      return this.authenticateUser(user, 'mock_token_superadmin')
    }
    
    if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
      const user: User = {
        id: 2,
        email: credentials.email,
        name: 'Admin User',
        role: UserRole.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      return this.authenticateUser(user, 'mock_token_admin')
    }

    if (credentials.email === 'moderator@example.com' && credentials.password === 'password') {
      const user: User = {
        id: 3,
        email: credentials.email,
        name: 'Moderator User',
        role: UserRole.MODERATOR,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      return this.authenticateUser(user, 'mock_token_moderator')
    }

    if (credentials.email === 'user@example.com' && credentials.password === 'password') {
      const user: User = {
        id: 4,
        email: credentials.email,
        name: 'Regular User',
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      return this.authenticateUser(user, 'mock_token_user')
    }

    return throwError(() => new Error('Invalid credentials'))
  }

  private authenticateUser(user: User, token: string): Observable<AuthResponse> {
    localStorage.setItem(this.TOKEN_KEY, token)
    localStorage.setItem(this.USER_KEY, JSON.stringify(user))
    this.currentUser.set(user)
    this.isAuthenticated.set(true)
    
    return of({ user, token }).pipe(delay(500))
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
    this.currentUser.set(null)
    this.isAuthenticated.set(false)
    this.router.navigate(['/login'])
  }

  hasRole(role: UserRole): boolean {
    const user = this.currentUser()
    if (!user) return false
    return user.role === role
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const user = this.currentUser()
    if (!user) return false
    return roles.includes(user.role)
  }

  private readonly roleHierarchy: Record<UserRole, number> = {
    [UserRole.SUPERADMIN]: 4,
    [UserRole.ADMIN]: 3,
    [UserRole.MODERATOR]: 2,
    [UserRole.USER]: 1
  }

  canAccess(requiredRole: UserRole): boolean {
    const user = this.currentUser()
    if (!user) return false
    return this.roleHierarchy[user.role] >= this.roleHierarchy[requiredRole]
  }

  canChangeUserPassword(targetUser: User): boolean {
    const currentUser = this.currentUser()
    if (!currentUser) return false

    // Users can always change their own password
    if (currentUser.id === targetUser.id) return true

    // Can change password if current user's role is higher than target user's role
    return this.roleHierarchy[currentUser.role] > this.roleHierarchy[targetUser.role]
  }

  getRolePriority(role: UserRole): number {
    return this.roleHierarchy[role]
  }

  isRoleHigherThan(role1: UserRole, role2: UserRole): boolean {
    return this.roleHierarchy[role1] > this.roleHierarchy[role2]
  }

  isRoleEqualOrHigherThan(role1: UserRole, role2: UserRole): boolean {
    return this.roleHierarchy[role1] >= this.roleHierarchy[role2]
  }
}

