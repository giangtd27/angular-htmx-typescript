import { Component, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { AuthService } from '../../services/auth.service'
import { LoginCredentials } from '../../models/user.model'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  credentials: LoginCredentials = { email: '', password: '' }
  error = signal<string | null>(null)
  loading = signal<boolean>(false)

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.credentials.email || !this.credentials.password) {
      this.error.set('Please fill in all fields')
      return
    }

    this.loading.set(true)
    this.error.set(null)

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.loading.set(false)
        const returnUrl = this.router.parseUrl(this.router.url).queryParams['returnUrl'] || '/users'
        this.router.navigateByUrl(returnUrl)
      },
      error: (err) => {
        this.loading.set(false)
        this.error.set(err.message || 'Login failed. Please try again.')
      }
    })
  }
}

