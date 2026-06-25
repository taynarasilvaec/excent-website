import { Component } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { BentoItem, ExcentBento } from '../../../../../components/excent-bento/excent-bento'
import { ExcentPill } from '../../../../../components/excent-pill/excent-pill'

@Component({
  selector: 'app-live-account-security',
  standalone: true,
  imports: [TranslateModule, ExcentBento, ExcentPill],
  templateUrl: './security.html',
  styleUrl: './security.scss',
})
export class LiveAccountSecurity {
  // Same card shell as everywhere — this page just arranges them in a 3-col grid
  // with the assets card spanning both rows (tall, left).
  protected readonly cards: BentoItem[] = [
    { icon: '/assets/icons/coins.svg', title: 'live-account.security.cards.assets.title', description: 'live-account.security.cards.assets.description', rowSpan: 2 },
    { icon: '/assets/icons/arrow-up.svg', title: 'live-account.security.cards.leverage.title' },
    { icon: '/assets/icons/coins.svg', title: 'live-account.security.cards.custody.title' },
    { icon: '/assets/icons/coins.svg', title: 'live-account.security.cards.deposit.title', description: 'live-account.security.cards.deposit.description' },
    { icon: '/assets/icons/coins.svg', title: 'live-account.security.cards.spreads.title', description: 'live-account.security.cards.spreads.description', link: 'live-account.security.cards.spreads.link' },
  ]
}
