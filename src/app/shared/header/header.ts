import { Component, ElementRef, HostListener, computed, inject, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { Router } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { CookieService } from 'ngx-cookie-service'
import { AppsMenu } from '../../components/apps-menu/apps-menu'
import { ExcentButton } from '../../components/excent-button/excent-button'
import { LanguageMenu } from '../../components/language-menu/language-menu'
import { Navbar } from '../../components/navbar/navbar'
import { ECOSYSTEM_APPS, EcosystemApp, LANGUAGE_MENU_OPTIONS, SUPPORTED_LANGUAGES, SupportedLanguage } from '../constants'
import { RevealDirective } from '../directives/reveal.directive'
import { LanguageService } from '../services/language.service'
import { SsoRedirectService } from '../services/sso-redirect.service'
import { ThemeService } from '../services/theme.service'
import { NAVBAR_ITEMS, NAVBAR_LOGO } from '../navbar.config'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [Navbar, ExcentButton, LanguageMenu, AppsMenu, RevealDirective, TranslateModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly _sso = inject(SsoRedirectService)
  private readonly _language = inject(LanguageService)
  private readonly _cookie = inject(CookieService)
  private readonly _router = inject(Router)
  private readonly _theme = inject(ThemeService)
  private readonly _elementRef: ElementRef<HTMLElement> = inject(ElementRef)
  private readonly _isLangMenuOpen = signal(false)
  private readonly _isAppsMenuOpen = signal(false)

  protected readonly NAVBAR_ITEMS = NAVBAR_ITEMS
  protected readonly LANGUAGE_OPTIONS = LANGUAGE_MENU_OPTIONS
  // Logo swaps per theme: blue wings always; white wordmark on dark, black on light.
  protected readonly navbarLogo = computed(() => ({
    ...NAVBAR_LOGO,
    src: this._theme.isDark()
      ? '/assets/images/logo-excent.svg'
      : '/assets/images/logo-excent-black.svg',
  }))
  protected readonly ECOSYSTEM_APPS = ECOSYSTEM_APPS
  protected readonly isLangMenuOpen = this._isLangMenuOpen.asReadonly()
  protected readonly isAppsMenuOpen = this._isAppsMenuOpen.asReadonly()
  protected readonly isDark = this._theme.isDark
  protected readonly currentLang = toSignal(this._language.language$, { initialValue: 'en' })

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this._isLangMenuOpen() && !this._isAppsMenuOpen()) return
    const target = event.target as Node
    if (!this._elementRef.nativeElement.contains(target)) {
      this._isLangMenuOpen.set(false)
      this._isAppsMenuOpen.set(false)
    }
  }

  protected onCreateAccount(): void {
    this._sso.goTo('sign-up')
  }

  protected onSignIn(): void {
    this._sso.goTo('sign-in')
  }

  protected onLanguageClick(): void {
    this._isAppsMenuOpen.set(false)
    this._isLangMenuOpen.update((open) => !open)
  }

  protected onLanguageSelect(code: SupportedLanguage): void {
    this._language.setLanguage(code)
    this._cookie.set('language', code, { path: '/' })
    this._isLangMenuOpen.set(false)

    const currentUrl = this._router.url
    const langPattern = SUPPORTED_LANGUAGES.join('|')
    const newUrl = currentUrl.replace(
      new RegExp(`^/(${langPattern})(?=/|$|\\?)`),
      `/${code}`,
    )
    this._router.navigateByUrl(newUrl)
  }

  protected onAppsClick(): void {
    this._isLangMenuOpen.set(false)
    this._isAppsMenuOpen.update((open) => !open)
  }

  protected onAppNavigate(_app: EcosystemApp): void {
    this._isAppsMenuOpen.set(false)
  }

  protected onThemeToggle(): void {
    this._theme.toggle()
  }
}
