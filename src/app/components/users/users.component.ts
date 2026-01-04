import { Component, OnInit, signal, AfterViewInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { UserService } from '../../services/user.service'
import { AuthService } from '../../services/auth.service'
import { User, UserRole, DialogType } from '../../models/user.model'
import { HtmxService } from '../../services/htmx.service'
import { UserFormComponent } from '../user-form/user-form.component'
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component'
import { UpdatePasswordComponent } from '../update-password/update-password.component'
import { formatDateTime } from '../../utils/date.util'

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, UserFormComponent, ConfirmationDialogComponent, UpdatePasswordComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit, AfterViewInit {
  users = signal<User[]>([])
  loading = signal<boolean>(false)
  canEdit = signal<boolean>(false)
  canDelete = signal<boolean>(false)
  showCreateDialog = signal<boolean>(false)
  showUpdateDialog = signal<boolean>(false)
  showDeleteDialog = signal<boolean>(false)
  showPasswordDialog = signal<boolean>(false)
  selectedUser = signal<User | null>(null)
  userToDelete = signal<User | null>(null)
  userToChangePassword = signal<User | null>(null)

  readonly DialogType = DialogType

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private htmxService: HtmxService
  ) {}

  ngOnInit(): void {
    this.canEdit.set(this.authService.isAdmin() || this.authService.isSuperAdmin())
    this.canDelete.set(this.authService.isSuperAdmin())
    this.loadUsers()
  }

  ngAfterViewInit(): void {
    // Ensure HTMX is initialized
    this.htmxService.init()
    
    // Set up HTMX event listeners
    this.setupHtmxEvents()
  }

  private setupHtmxEvents(): void {
    // Listen for HTMX events to refresh the list
    document.body.addEventListener('htmx:afterSwap', (event: any) => {
      const target = event.detail.target
      
      // If a form was submitted successfully, refresh the users list
      if (target.id === 'dialog-container' && event.detail.xhr?.status === 200) {
        const form = target.querySelector('form')
        if (form && form.getAttribute('hx-post')) {
          // User was created/updated, refresh the list
          setTimeout(() => {
            this.htmxService.triggerEvent('refreshUsers')
            this.loadUsers()
          }, 300)
        }
      }
    })

    // Handle delete confirmations
    document.body.addEventListener('htmx:afterSwap', (event: any) => {
      const target = event.detail.target
      if (target.id === 'dialog-container') {
        const deleteForm = target.querySelector('form[hx-delete]')
        if (deleteForm) {
          // Delete was confirmed, refresh the list
          deleteForm.addEventListener('htmx:afterSwap', () => {
            this.htmxService.triggerEvent('refreshUsers')
            this.loadUsers()
          })
        }
      }
    })
  }

  loadUsers(): void {
    this.loading.set(true)
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users.set(users)
        this.loading.set(false)
      },
      error: () => {
        this.loading.set(false)
      }
    })
  }

  getRoleLabel(role: UserRole): string {
    return role.charAt(0).toUpperCase() + role.slice(1)
  }

  formatDate(date: Date): string {
    return formatDateTime(date)
  }

  // Create user
  onCreate(): void {
    this.selectedUser.set(null)
    this.showCreateDialog.set(true)
  }

  // Edit user
  onEdit(user: User): void {
    this.selectedUser.set({ ...user })
    this.showUpdateDialog.set(true)
  }

  // Delete user
  onDelete(user: User): void {
    this.userToDelete.set(user)
    this.showDeleteDialog.set(true)
  }

  // Handle user created
  onUserCreated(): void {
    this.loadUsers()
    this.showCreateDialog.set(false)
    this.selectedUser.set(null)
  }

  // Handle user updated
  onUserUpdated(): void {
    this.loadUsers()
    this.showUpdateDialog.set(false)
    this.selectedUser.set(null)
  }

  // Handle user deleted
  confirmDelete(): void {
    const user = this.userToDelete()
    if (!user) return

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.loadUsers()
        this.showDeleteDialog.set(false)
        this.userToDelete.set(null)
      },
      error: () => {
        this.showDeleteDialog.set(false)
        this.userToDelete.set(null)
      }
    })
  }

  cancelDelete(): void {
    this.showDeleteDialog.set(false)
    this.userToDelete.set(null)
  }

  cancelCreate(): void {
    this.showCreateDialog.set(false)
    this.selectedUser.set(null)
  }

  cancelUpdate(): void {
    this.showUpdateDialog.set(false)
    this.selectedUser.set(null)
  }

  // Change user password (admin function)
  onChangePassword(user: User): void {
    this.userToChangePassword.set(user)
    this.showPasswordDialog.set(true)
  }

  // Handle password updated
  onPasswordUpdated(): void {
    this.showPasswordDialog.set(false)
    this.userToChangePassword.set(null)
  }

  cancelPasswordChange(): void {
    this.showPasswordDialog.set(false)
    this.userToChangePassword.set(null)
  }

  // Check if current user can change password for target user
  canChangePassword(user: User): boolean {
    return this.authService.canChangeUserPassword(user)
  }

  // Called by HTMX after-swap event to open dialog (for HTMX-loaded content)
  openDialog(): void {
    setTimeout(() => {
      const dialog = document.querySelector('#dialog-container dialog')
      if (dialog) {
        (dialog as HTMLDialogElement).showModal()
      }
    }, 100)
  }
}
