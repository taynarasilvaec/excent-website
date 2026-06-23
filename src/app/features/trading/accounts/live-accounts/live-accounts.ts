import { Component } from '@angular/core'
import { LiveAccountFaq } from './faq/faq'
import { LiveAccountHighlights } from './highlights/highlights'
import { LiveAccountMarket } from './market/market'
import { LiveAccountSecurity } from './security/security'

@Component({
  selector: 'app-live-accounts',
  standalone: true,
  imports: [LiveAccountMarket, LiveAccountSecurity, LiveAccountHighlights, LiveAccountFaq],
  templateUrl: './live-accounts.html',
  styleUrl: './live-accounts.scss',
})
export class LiveAccounts {}
