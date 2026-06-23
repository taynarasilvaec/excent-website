import { DOCUMENT, isPlatformBrowser } from '@angular/common'
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'theme'

/**
 * App theme (dark/light). Dark is the default. The active theme is reflected
 * by toggling the `dark` class on <html> (consumed by Tailwind's
 * `@custom-variant dark` and the `.dark` token block in styles.scss) and
 * persisted to localStorage. SSR-safe.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _platformId = inject(PLATFORM_ID)
  private readonly _document = inject(DOCUMENT)
  private readonly _theme = signal<Theme>(this._initialTheme())

  public readonly theme = this._theme.asReadonly()
  public readonly isDark = computed(() => this._theme() === 'dark')

  constructor() {
    this._apply(this._theme())
  }

  public toggle(): void {
    this.set(this._theme() === 'dark' ? 'light' : 'dark')
  }

  public set(theme: Theme): void {
    this._theme.set(theme)
    this._apply(theme)
    if (isPlatformBrowser(this._platformId)) {
      localStorage.setItem(STORAGE_KEY, theme)
    }
  }

  private _initialTheme(): Theme {
    if (!isPlatformBrowser(this._platformId)) return 'dark'
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'light' ? 'light' : 'dark'
  }

  private _apply(theme: Theme): void {
    const root = this._document.documentElement
    root.classList.toggle('dark', theme === 'dark')
  }
}
