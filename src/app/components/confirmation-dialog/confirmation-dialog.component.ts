import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DialogType } from '../../models/user.model'

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent implements AfterViewInit, OnDestroy {
  @ViewChild('dialog', { static: false }) dialogRef!: ElementRef<HTMLDialogElement>
  @Input() title: string = 'Confirm Action'
  @Input() message: string = 'Are you sure you want to perform this action?'
  @Input() confirmText: string = 'Confirm'
  @Input() cancelText: string = 'Cancel'
  @Input() type: DialogType = DialogType.DELETE
  @Input() open: boolean = false
  @Output() confirmed = new EventEmitter<void>()
  @Output() cancelled = new EventEmitter<void>()
  @Output() closed = new EventEmitter<void>()

  readonly DialogType = DialogType

  private observer?: MutationObserver

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

  onConfirm(): void {
    this.confirmed.emit()
    this.close()
  }

  onCancel(): void {
    this.cancelled.emit()
    this.close()
  }
}

