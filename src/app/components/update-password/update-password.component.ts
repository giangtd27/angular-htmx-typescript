import { Component, Input, Output, EventEmitter, OnInit, signal, ViewChild, ElementRef, AfterViewInit, OnDestroy, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { UserService } from '../../services/user.service'
import { AuthService } from '../../services/auth.service'
import { PasswordUpdate, UserRole, DialogType } from '../../models/user.model'
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component'

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationDialogComponent],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.scss'
})
export class UpdatePasswordComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('dialog', { static: false }) dialogRef!: ElementRef<HTMLDialogElement>
  @Input() open: boolean = false
  @Input() userId: number | null = null
  @Input() targetUser: any = null // User object when changing another user's password
  @Output() saved = new EventEmitter<void>()
  @Output() cancelled = new EventEmitter<void>()
  @Output() closed = new EventEmitter<void>()

  formData: PasswordUpdate = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  showConfirmDialog = signal<boolean>(false)
  loading = signal<boolean>(false)
  error = signal<string | null>(null)
  showPassword = signal({
    current: false,
    new: false,
    confirm: false
  })
  isAdminChange = signal<boolean>(false)
  requiresStrictValidation = computed(() => {
    const currentUser = this.authService.user()
    
    // Superadmin and Admin bypass all validation
    if (currentUser && (currentUser.role === UserRole.SUPERADMIN || currentUser.role === UserRole.ADMIN)) {
      return false
    }
    
    // If admin is changing another user's password, check the target user's role
    if (this.isAdminChange() && this.targetUser) {
      return this.targetUser.role !== UserRole.SUPERADMIN && this.targetUser.role !== UserRole.ADMIN
    }
    
    // If user is changing their own password, check their role
    if (currentUser) {
      return currentUser.role !== UserRole.SUPERADMIN && currentUser.role !== UserRole.ADMIN
    }
    
    // Default to strict validation if we can't determine
    return true
  })

  canBypassValidation = computed(() => {
    const currentUser = this.authService.user()
    return currentUser && (currentUser.role === UserRole.SUPERADMIN || currentUser.role === UserRole.ADMIN)
  })

  readonly DialogType = DialogType

  getPasswordHint(): string {
    if (this.canBypassValidation()) {
      return 'No password restrictions (Superadmin/Admin privilege)'
    } else if (this.requiresStrictValidation()) {
      return 'Password must be at least 6 characters long and contain at least one number and one symbol (!@#$%^&*()_+-=[]{}|;:,.<>?)'
    } else {
      return 'Password must be at least 6 characters long'
    }
  }

  private observer?: MutationObserver

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check if this is an admin changing another user's password
    if (this.targetUser) {
      const currentUser = this.authService.user()
      if (currentUser && currentUser.id !== this.targetUser.id) {
        this.isAdminChange.set(true)
        this.userId = this.targetUser.id
      } else {
        // User changing their own password
        this.userId = this.targetUser.id
      }
    } else {
      // Use current user's ID if not provided
      if (!this.userId) {
        const currentUser = this.authService.user()
        if (currentUser) {
          this.userId = currentUser.id
        }
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.dialogRef?.nativeElement) {
      this.setupDialog()
      setTimeout(() => {
        this.show()
      }, 0)
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect()
    }
  }

  private setupDialog(): void {
    const dialog = this.dialogRef.nativeElement
    
    this.observer = new MutationObserver(() => {
      if (dialog.open && !this.open) {
        this.open = true
      } else if (!dialog.open && this.open) {
        this.open = false
        this.closed.emit()
      }
    })

    this.observer.observe(dialog, {
      attributes: true,
      attributeFilter: ['open']
    })

    dialog.addEventListener('close', () => {
      this.closed.emit()
    })

    dialog.addEventListener('cancel', (e) => {
      e.preventDefault()
      this.onCancel()
    })
  }

  show(): void {
    if (this.dialogRef?.nativeElement) {
      this.dialogRef.nativeElement.showModal()
    }
  }

  close(): void {
    if (this.dialogRef?.nativeElement) {
      this.dialogRef.nativeElement.close()
    }
  }

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm'): void {
    this.showPassword.update(state => ({
      ...state,
      [field]: !state[field]
    }))
  }

  private validatePassword(password: string): { valid: boolean; message: string } {
    // Superadmin and Admin bypass all validation
    if (this.canBypassValidation()) {
      return { valid: true, message: '' }
    }

    if (password.length < 6) {
      return { valid: false, message: 'Password must be at least 6 characters long' }
    }

    // Check for strict validation (number and symbol) for non-admin users
    if (this.requiresStrictValidation()) {
      const hasNumber = /\d/.test(password)
      // Match any non-alphanumeric character (symbols)
      const hasSymbol = /[^a-zA-Z0-9]/.test(password)

      if (!hasNumber) {
        return { valid: false, message: 'Password must contain at least one number' }
      }

      if (!hasSymbol) {
        return { valid: false, message: 'Password must contain at least one symbol (e.g., !@#$%^&*()_+-=[]{}|;:,.<>?)' }
      }
    }

    return { valid: true, message: '' }
  }

  onSubmit(): void {
    this.error.set(null)

    // For admin changes, current password is not required
    if (!this.isAdminChange()) {
      if (!this.formData.currentPassword || !this.formData.newPassword || !this.formData.confirmPassword) {
        this.error.set('Please fill in all fields')
        return
      }
    } else {
      if (!this.formData.newPassword || !this.formData.confirmPassword) {
        this.error.set('Please fill in new password and confirmation')
        return
      }
    }

    if (this.formData.newPassword !== this.formData.confirmPassword) {
      this.error.set('New password and confirm password do not match')
      return
    }

    // Validate password based on user role
    const validation = this.validatePassword(this.formData.newPassword)
    if (!validation.valid) {
      this.error.set(validation.message)
      return
    }

    if (!this.isAdminChange() && this.formData.currentPassword === this.formData.newPassword) {
      this.error.set('New password must be different from current password')
      return
    }

    this.showConfirmDialog.set(true)
  }

  confirmSave(): void {
    if (!this.userId) {
      this.error.set('User ID is required')
      return
    }

    this.loading.set(true)
    this.error.set(null)
    this.showConfirmDialog.set(false)

    // For admin changes, pass empty string for current password
    const currentPassword = this.isAdminChange() ? '' : this.formData.currentPassword

    this.userService.updatePassword(
      this.userId,
      currentPassword,
      this.formData.newPassword,
      this.isAdminChange()
    ).subscribe({
      next: () => {
        this.loading.set(false)
        this.close()
        this.formData = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
        this.saved.emit()
      },
      error: (err) => {
        this.loading.set(false)
        this.error.set(err.message || 'Failed to update password. Please try again.')
      }
    })
  }

  cancelSave(): void {
    this.showConfirmDialog.set(false)
  }

  onCancel(): void {
    this.close()
    this.formData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    this.error.set(null)
    this.cancelled.emit()
  }
}

