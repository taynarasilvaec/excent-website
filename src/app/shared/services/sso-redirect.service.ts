import { Injectable, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { env } from '../../../environment/environment'

@Injectable({ providedIn: 'root' })
export class SsoRedirectService {
  private readonly _translate = inject(TranslateService)

  private _buildParams(): string {
    const lang =
      this._translate.currentLang ||
      this._translate.getDefaultLang() ||
      'en'
    return new URLSearchParams({
      platform: 'landing',
      origin: `/${lang}/`,
    }).toString()
  }

  public goTo(path: 'sign-in' | 'sign-up'): void {
    window.location.href = `${env.ACCOUNTS}/${path}?${this._buildParams()}`
  }

  public goToTrading(): void {
    window.location.href = `${env.TRADING}?${this._buildParams()}`
  }
}
