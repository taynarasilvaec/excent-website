import { Component, inject } from '@angular/core'
import { ExcentBentoCard } from '../../../../components/excent-bento-card/excent-bento-card'
import { ExcentButton } from '../../../../components/excent-button/excent-button'
import { ExcentText } from '../../../../components/excent-text/excent-text'
import { LiveSpark } from '../../../../components/live-spark/live-spark'
import { RevealDirective } from '../../../../shared/directives/reveal.directive'
import { DevicePlatformService } from '../../../../shared/services/device-platform.service'
import { SsoRedirectService } from '../../../../shared/services/sso-redirect.service'
import { STORE_URLS } from '../../../../shared/constants'

@Component({
  selector: 'app-platform',
  standalone: true,
  imports: [ExcentText, ExcentButton, ExcentBentoCard, LiveSpark, RevealDirective],
  templateUrl: './platform.html',
  styleUrl: './platform.scss',
})
export class Platform {
  private readonly _device = inject(DevicePlatformService)
  private readonly _sso = inject(SsoRedirectService)

  protected readonly heroBg = '/images/section-1-hero.png'
  protected readonly assetsImg = '/assets/images/platform-assets.png'

  // Lead with the action that fits the device: "Download App" first on mobile,
  // "Web Version" first on desktop. Only the visual ORDER swaps (CSS `order`) —
  // "Download App" stays the primary (white) button and "Web Version" the
  // secondary (outline) one. SSR has no user-agent, so it renders the desktop
  // order and corrects on hydration.
  protected readonly appFirst = this._device.isMobileOS

  protected onDownloadApp(): void {
    // Open the store matching the user's OS (defaults to Play Store on desktop).
    const url = this._device.isIOS ? STORE_URLS.appStore : STORE_URLS.playStore
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  protected onWebVersion(): void {
    this._sso.goToTrading()
  }

  protected onMamLearnMore(): void {
    // TODO: route to the MAM ecosystem page (trading/accounts/mam-ecosystem).
  }
}
