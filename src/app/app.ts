import { CommonModule } from '@angular/common'
import { Component, DestroyRef, inject, OnInit } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { filter, firstValueFrom, map, mergeMap } from 'rxjs'
import { SUPPORTED_LANGUAGES, SupportedLanguage } from './shared/constants'
import { AuthCookieService } from './shared/services/auth-cookie.service'
import { LanguageService } from './shared/services/language.service'
import { getCookie } from './shared/utils'

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private _translateService = inject(TranslateService)
  private _titleService = inject(Title)
  private _router = inject(Router)
  private _activatedRoute = inject(ActivatedRoute)
  private _destroyRef = inject(DestroyRef)
  private _auth = inject(AuthCookieService)
  private _language = inject(LanguageService)

  private readonly BASE_TITLE = 'Excent Capital'
  private browserTitle = ''
  private selectedLang = ''
  private lastTranslatedKey = ''
  private lastLanguage = ''

  ngOnInit(): void {
    this.initLanguage()
    this.setDynamicTitle()
    this._auth.init()
  }

  private initLanguage(): void {
    this._translateService.addLangs([...SUPPORTED_LANGUAGES])
    this._translateService.setDefaultLang('en')

    const urlLang = this.extractLangFromUrl(this._router.url)
    const cookieLang = getCookie('language')
    const candidate = (urlLang ?? cookieLang ?? 'en') as SupportedLanguage
    const lang = SUPPORTED_LANGUAGES.includes(candidate) ? candidate : 'en'

    this._translateService.use(lang)
    this._language.setLanguage(lang)

    this._language.language$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((current) => {
        if (this._translateService.currentLang !== current) {
          this._translateService.use(current)
        }
        this.selectedLang = current
        this.updateTitle()
      })

    this._router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((event) => {
        const newLang = this.extractLangFromUrl(event.urlAfterRedirects)
        if (newLang && newLang !== this._translateService.currentLang) {
          this._translateService.use(newLang)
          this._language.setLanguage(newLang)
        }
      })
  }

  private extractLangFromUrl(url: string): SupportedLanguage | null {
    const match = url.match(/^\/([a-z]{2,3})(\/|$|\?)/i)
    const lang = match?.[1]?.toLowerCase()
    return lang && (SUPPORTED_LANGUAGES as readonly string[]).includes(lang)
      ? (lang as SupportedLanguage)
      : null
  }

  private setDynamicTitle(): void {
    this._router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let route = this._activatedRoute
          while (route.firstChild) route = route.firstChild
          return route
        }),
        mergeMap(route => route.data),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe(data => {
        this.browserTitle = data['title'] ?? ''
        this.updateTitle()
      })
  }

  private updateTitle(): void {
    const baseTitle = this.BASE_TITLE
    const differentLanguage = this.selectedLang !== this.lastLanguage
    const differentTitle = this.browserTitle
      ? this.browserTitle !== this.lastTranslatedKey
      : this.lastTranslatedKey !== baseTitle

    if (this.browserTitle && (differentTitle || differentLanguage)) {
      this.lastTranslatedKey = this.browserTitle
      this.lastLanguage = this.selectedLang

      firstValueFrom(this._translateService.get(this.browserTitle))
        .then((translated: string) => {
          this._titleService.setTitle(`${translated} | ${baseTitle}`)
        })
    } else if (!this.browserTitle && differentTitle) {
      this.lastTranslatedKey = baseTitle
      this._titleService.setTitle(baseTitle)
    }
  }
}
