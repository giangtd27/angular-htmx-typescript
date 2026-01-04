import { Injectable } from '@angular/core'
import { Observable, of, throwError } from 'rxjs'
import { delay } from 'rxjs/operators'
import { User, UserRole } from '../models/user.model'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [
    {
      id: 1,
      email: 'superadmin@example.com',
      name: 'Super Admin',
      role: UserRole.SUPERADMIN,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 2,
      email: 'admin@example.com',
      name: 'Admin User',
      role: UserRole.ADMIN,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02')
    },
    {
      id: 3,
      email: 'moderator@example.com',
      name: 'Moderator User',
      role: UserRole.MODERATOR,
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03')
    },
    {
      id: 4,
      email: 'user@example.com',
      name: 'Regular User',
      role: UserRole.USER,
      createdAt: new Date('2024-01-04'),
      updatedAt: new Date('2024-01-04')
    }
  ]

  private nextId = 5

  getAllUsers(): Observable<User[]> {
    return of([...this.users]).pipe(delay(300))
  }

  getUserById(id: number): Observable<User> {
    const user = this.users.find(u => u.id === id)
    if (!user) {
      return throwError(() => new Error('User not found'))
    }
    return of({ ...user }).pipe(delay(200))
  }

  createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Observable<User> {
    const newUser: User = {
      ...userData,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.users.push(newUser)
    return of({ ...newUser }).pipe(delay(300))
  }

  updateUser(id: number, userData: Partial<User>): Observable<User> {
    const index = this.users.findIndex(u => u.id === id)
    if (index === -1) {
      return throwError(() => new Error('User not found'))
    }
    
    this.users[index] = {
      ...this.users[index],
      ...userData,
      id,
      updatedAt: new Date()
    }
    
    return of({ ...this.users[index] }).pipe(delay(300))
  }

  deleteUser(id: number): Observable<void> {
    const index = this.users.findIndex(u => u.id === id)
    if (index === -1) {
      return throwError(() => new Error('User not found'))
    }
    
    this.users.splice(index, 1)
    return of(undefined).pipe(delay(300))
  }

  updatePassword(userId: number, currentPassword: string, newPassword: string, isAdminChange: boolean = false): Observable<void> {
    const user = this.users.find(u => u.id === userId)
    if (!user) {
      return throwError(() => new Error('User not found'))
    }

    // For admin password changes, skip current password verification
    if (!isAdminChange) {
      // Mock password validation - in real app, verify current password
      if (currentPassword !== 'password') {
        return throwError(() => new Error('Current password is incorrect'))
      }
    }

    // Mock password update - in real app, hash and save new password
    return of(undefined).pipe(delay(300))
  }
}

