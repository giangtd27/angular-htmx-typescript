import { inject } from '@angular/core'
import { Router, CanActivateFn } from '@angular/router'
import { AuthService } from '../services/auth.service'
import { UserRole } from '../models/user.model'

export const roleGuard = (requiredRole: UserRole): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService)
    const router = inject(Router)

    if (!authService.authenticated()) {
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } })
      return false
    }

    if (!authService.canAccess(requiredRole)) {
      router.navigate(['/unauthorized'])
      return false
    }

    return true
  }
}

