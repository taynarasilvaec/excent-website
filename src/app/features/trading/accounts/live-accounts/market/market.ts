import { Component, inject } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { ExcentButton } from '../../../../../components/excent-button/excent-button'
import { SsoRedirectService } from '../../../../../shared/services/sso-redirect.service'

@Component({
  selector: 'app-live-account-market',
  standalone: true,
  imports: [ExcentButton, TranslateModule],
  templateUrl: './market.html',
  styleUrl: './market.scss',
})
export class LiveAccountMarket {
  private readonly _sso = inject(SsoRedirectService)

  protected onCreateAccount(): void {
    this._sso.goTo('sign-up')
  }

  protected onDemoAccount(): void {
    this._sso.goTo('sign-up')
  }
}
