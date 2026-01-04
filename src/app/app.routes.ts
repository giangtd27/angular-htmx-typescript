import { Routes } from '@angular/router'
import { authGuard } from './guards/auth.guard'
import { roleGuard } from './guards/role.guard'
import { UserRole } from './models/user.model'

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: 'users',
        loadComponent: () => import('./components/users/users.component').then(m => m.UsersComponent),
        canActivate: [authGuard]
      },
      {
        path: '',
        redirectTo: '/users',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/users'
  }
];
