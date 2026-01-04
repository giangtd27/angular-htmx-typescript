import { Component, Input, Output, EventEmitter, OnInit, signal, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { User, UserRole, DialogType } from '../../models/user.model'
import { UserService } from '../../services/user.service'
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component'

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationDialogComponent],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('dialog', { static: false }) dialogRef!: ElementRef<HTMLDialogElement>
  @Input() user: User | null = null
  @Input() open: boolean = false
  @Output() saved = new EventEmitter<void>()
  @Output() cancelled = new EventEmitter<void>()
  @Output() closed = new EventEmitter<void>()

  formData = {
    name: '',
    email: '',
    role: UserRole.USER
  }
  showConfirmDialog = signal<boolean>(false)
  loading = signal<boolean>(false)
  error = signal<string | null>(null)
  isEditMode = false

  roles = Object.values(UserRole)
  readonly DialogType = DialogType
  private observer?: MutationObserver

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    if (this.user) {
      this.isEditMode = true
      this.formData = {
        name: this.user.name,
        email: this.user.email,
        role: this.user.role
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.dialogRef?.nativeElement) {
      this.setupDialog()
      // Always show dialog when component is rendered
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
    
    // Watch for open attribute changes
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

    // Handle native close events
    dialog.addEventListener('close', () => {
      this.closed.emit()
    })

    // Handle cancel events (ESC key)
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

  onSubmit(): void {
    if (!this.formData.name || !this.formData.email) {
      this.error.set('Please fill in all required fields')
      return
    }

    this.showConfirmDialog.set(true)
  }

  confirmSave(): void {
    this.loading.set(true)
    this.error.set(null)
    this.showConfirmDialog.set(false)

    const data = this.formData
    const operation = this.isEditMode
      ? this.userService.updateUser(this.user!.id, data)
      : this.userService.createUser(data)

    operation.subscribe({
      next: () => {
        this.loading.set(false)
        this.close()
        this.saved.emit()
      },
      error: (err) => {
        this.loading.set(false)
        this.error.set(err.message || 'An error occurred')
      }
    })
  }

  cancelSave(): void {
    this.showConfirmDialog.set(false)
  }

  onCancel(): void {
    this.close()
    this.cancelled.emit()
  }

  getRoleLabel(role: UserRole): string {
    return role.charAt(0).toUpperCase() + role.slice(1)
  }
}

