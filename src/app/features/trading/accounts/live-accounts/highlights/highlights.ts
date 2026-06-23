import { Component, inject, signal } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { ExcentButton } from '../../../../../components/excent-button/excent-button'
import { ExcentGlow } from '../../../../../components/excent-glow/excent-glow'
import { STORE_URLS } from '../../../../../shared/constants'
import { DevicePlatformService } from '../../../../../shared/services/device-platform.service'
import { SsoRedirectService } from '../../../../../shared/services/sso-redirect.service'

interface RegistrationStep {
  id: number
  labelKey?: string
  titleKey: string
  descriptionKey: string
}

@Component({
  selector: 'app-live-account-highlights',
  standalone: true,
  imports: [ExcentButton, ExcentGlow, TranslateModule],
  templateUrl: './highlights.html',
  styleUrl: './highlights.scss',
})
export class LiveAccountHighlights {
  private readonly _sso = inject(SsoRedirectService)
  private readonly _device = inject(DevicePlatformService)

  protected readonly activeStep = signal(1)

  protected readonly steps: ReadonlyArray<RegistrationStep> = [
    {
      id: 1,
      labelKey: 'live-account.highlights.registration.step-1-label',
      titleKey: 'live-account.highlights.registration.step-1-title',
      descriptionKey: 'live-account.highlights.registration.step-1-description',
    },
    {
      id: 2,
      titleKey: 'live-account.highlights.registration.step-2-title',
      descriptionKey: 'live-account.highlights.registration.step-2-description',
    },
    {
      id: 3,
      titleKey: 'live-account.highlights.registration.step-3-title',
      descriptionKey: 'live-account.highlights.registration.step-3-description',
    },
  ]

  protected onStepClick(stepId: number): void {
    this.activeStep.set(stepId)
  }

  protected onCreateAccount(): void {
    this._sso.goTo('sign-up')
  }

  protected onDownloadApp(): void {
    const url = this._device.isAndroid ? STORE_URLS.playStore : STORE_URLS.appStore
    window.open(url, '_blank', 'noopener')
  }

  protected onSignUp(): void {
    this._sso.goTo('sign-up')
  }

  protected onCreateDemoAccount(): void {
    this._sso.goTo('sign-up')
  }
}
