import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnDestroy, OnChanges, SimpleChanges, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ThemeMode } from '../../models/user.model'

@Component({
  selector: 'app-theme-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-selector.component.html',
  styleUrl: './theme-selector.component.scss'
})
export class ThemeSelectorComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('dialog', { static: false }) dialogRef!: ElementRef<HTMLDivElement>
  @Input() open: boolean = false
  @Input() currentMode: ThemeMode = ThemeMode.SYSTEM
  @Input() buttonElement?: HTMLElement
  @Output() selected = new EventEmitter<ThemeMode>()
  @Output() closed = new EventEmitter<void>()

  readonly ThemeMode = ThemeMode
  hoveredMode = signal<ThemeMode | null>(null)
  
  private escKeyHandler?: (e: KeyboardEvent) => void
  private documentClickHandler?: (e: MouseEvent) => void

  ngAfterViewInit(): void {
    if (this.open) {
      this.setupEventListeners()
      this.positionDialog()
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']) {
      if (this.open) {
        this.setupEventListeners()
        requestAnimationFrame(() => {
          this.positionDialog()
        })
      } else {
        this.removeEventListeners()
      }
    }
  }

  private positionDialog(): void {
    if (!this.buttonElement || !this.dialogRef?.nativeElement) return

    const buttonRect = this.buttonElement.getBoundingClientRect()
    const dialog = this.dialogRef.nativeElement
    const dialogRect = dialog.getBoundingClientRect()

    // Position dialog centered above the button
    const top = buttonRect.top - dialogRect.height - 8
    const left = buttonRect.left + (buttonRect.width / 2) - (dialogRect.width / 2)

    // Ensure dialog stays within viewport
    const padding = 16
    let finalLeft = left
    if (finalLeft < padding) {
      finalLeft = padding
    } else if (finalLeft + dialogRect.width > window.innerWidth - padding) {
      finalLeft = window.innerWidth - dialogRect.width - padding
    }

    let finalTop = top
    if (finalTop < padding) {
      // If not enough space above, position below the button
      finalTop = buttonRect.bottom + 8
    }

    dialog.style.top = `${finalTop}px`
    dialog.style.left = `${finalLeft}px`
  }

  ngOnDestroy(): void {
    this.removeEventListeners()
  }

  private setupEventListeners(): void {
    if (!this.open) return

    // ESC key handler
    this.escKeyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.open) {
        e.preventDefault()
        e.stopPropagation()
        this.close()
      }
    }

    // Document click handler to detect clicks outside the dialog
    this.documentClickHandler = (e: MouseEvent) => {
      if (!this.open || !this.dialogRef?.nativeElement) return

      const target = e.target as Node
      const dialogElement = this.dialogRef.nativeElement

      // Check if click is outside the dialog
      if (!dialogElement.contains(target) && !this.buttonElement?.contains(target)) {
        this.close()
      }
    }

    // Use capture phase to catch clicks before they bubble
    document.addEventListener('keydown', this.escKeyHandler)
    document.addEventListener('click', this.documentClickHandler, true)
  }

  private removeEventListeners(): void {
    if (this.escKeyHandler) {
      document.removeEventListener('keydown', this.escKeyHandler)
      this.escKeyHandler = undefined
    }
    if (this.documentClickHandler) {
      document.removeEventListener('click', this.documentClickHandler, true)
      this.documentClickHandler = undefined
    }
  }

  close(): void {
    this.closed.emit()
  }

  selectTheme(mode: ThemeMode): void {
    this.selected.emit(mode)
    this.close()
  }

  onMouseEnter(mode: ThemeMode): void {
    this.hoveredMode.set(mode)
  }

  onMouseLeave(): void {
    this.hoveredMode.set(null)
  }
}

