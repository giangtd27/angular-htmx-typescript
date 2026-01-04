import { Component, signal, computed, OnDestroy, ViewChild, ElementRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Router } from '@angular/router'
import { AuthService } from '../../services/auth.service'
import { UpdatePasswordComponent } from '../update-password/update-password.component'
import { ThemeSelectorComponent } from '../theme-selector/theme-selector.component'
import { ThemeMode } from '../../models/user.model'

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, UpdatePasswordComponent, ThemeSelectorComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnDestroy {
  @ViewChild('themeButton', { static: false }) themeButtonRef!: ElementRef<HTMLButtonElement>
  themeMode = signal<ThemeMode>(ThemeMode.SYSTEM)
  showPasswordDialog = signal<boolean>(false)
  showThemeSelector = signal<boolean>(false)
  private systemPreferenceListener?: MediaQueryList

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    this.initializeTheme()
  }

  ngOnDestroy(): void {
    if (this.systemPreferenceListener) {
      this.systemPreferenceListener.removeEventListener('change', this.handleSystemPreferenceChange)
    }
  }

  private initializeTheme(): void {
    // Check for saved theme configuration in localStorage
    let savedTheme: string | null = null
    try {
      const configurations = localStorage.getItem('configurations')
      if (configurations) {
        const config = JSON.parse(configurations)
        savedTheme = config?.themes?.mode || null
      }
    } catch (e) {
      // If parsing fails, treat as no saved configuration
    }

    if (savedTheme && Object.values(ThemeMode).includes(savedTheme as ThemeMode)) {
      // Use saved theme preference
      this.themeMode.set(savedTheme as ThemeMode)
    } else {
      // No saved configuration - use system preference
      this.themeMode.set(ThemeMode.SYSTEM)
    }

    this.applyTheme()
    this.setupSystemPreferenceListener()
  }

  private applyTheme(): void {
    const mode = this.themeMode()
    let isDark = false

    if (mode === ThemeMode.SYSTEM) {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    } else {
      isDark = mode === ThemeMode.DARK
    }

    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  private setupSystemPreferenceListener(): void {
    if (this.themeMode() === ThemeMode.SYSTEM) {
      this.systemPreferenceListener = window.matchMedia('(prefers-color-scheme: dark)')
      this.handleSystemPreferenceChange = this.handleSystemPreferenceChange.bind(this)
      this.systemPreferenceListener.addEventListener('change', this.handleSystemPreferenceChange)
    }
  }

  private handleSystemPreferenceChange = (event: MediaQueryListEvent): void => {
    if (this.themeMode() === ThemeMode.SYSTEM) {
      this.applyTheme()
    }
  }

  openThemeSelector(): void {
    this.showThemeSelector.set(true)
  }

  onThemeSelected(mode: ThemeMode): void {
    const currentMode = this.themeMode()
    
    this.themeMode.set(mode)
    this.applyTheme()

    // Remove old listener if switching away from SYSTEM
    if (this.systemPreferenceListener && currentMode === ThemeMode.SYSTEM) {
      this.systemPreferenceListener.removeEventListener('change', this.handleSystemPreferenceChange)
      this.systemPreferenceListener = undefined
    }

    // Add listener if switching to SYSTEM
    if (mode === ThemeMode.SYSTEM) {
      this.setupSystemPreferenceListener()
    }

    // Save to localStorage
    try {
      let configurations: any = {}
      const savedConfig = localStorage.getItem('configurations')
      if (savedConfig) {
        configurations = JSON.parse(savedConfig)
      }
      
      if (!configurations.themes) {
        configurations.themes = {}
      }
      
      configurations.themes.mode = mode
      localStorage.setItem('configurations', JSON.stringify(configurations))
    } catch (e) {
      console.error('Failed to save theme configuration:', e)
    }

    this.showThemeSelector.set(false)
  }

  onThemeSelectorClosed(): void {
    this.showThemeSelector.set(false)
  }

  darkMode = computed(() => {
    const mode = this.themeMode()
    if (mode === ThemeMode.SYSTEM) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return mode === ThemeMode.DARK
  })

  currentThemeMode = computed(() => this.themeMode())

  logout(): void {
    this.authService.logout()
  }

  openPasswordDialog(): void {
    this.showPasswordDialog.set(true)
  }

  onPasswordUpdated(): void {
    this.showPasswordDialog.set(false)
  }

  cancelPasswordUpdate(): void {
    this.showPasswordDialog.set(false)
  }

  get user() {
    return this.authService.user()
  }

  readonly ThemeMode = ThemeMode

  getThemeAriaLabel(): string {
    const mode = this.currentThemeMode()
    switch (mode) {
      case ThemeMode.LIGHT:
        return 'Switch to dark mode'
      case ThemeMode.DARK:
        return 'Switch to system preferred mode'
      case ThemeMode.SYSTEM:
        return 'Switch to light mode'
      default:
        return 'Toggle theme'
    }
  }

  getThemeTitle(): string {
    const mode = this.currentThemeMode()
    switch (mode) {
      case ThemeMode.LIGHT:
        return 'Light Mode (Click to switch to Dark)'
      case ThemeMode.DARK:
        return 'Dark Mode (Click to switch to System)'
      case ThemeMode.SYSTEM:
        return 'System Preferred Mode (Click to switch to Light)'
      default:
        return 'Toggle Theme'
    }
  }
}

