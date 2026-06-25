import { isPlatformBrowser } from '@angular/common'
import { Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { ExcentButton } from '../../../../../components/excent-button/excent-button'
import { ExcentPill } from '../../../../../components/excent-pill/excent-pill'
import { ExcentStaticIcon } from '../../../../../components/excent-static-icon/excent-static-icon'
import { LiveSpark } from '../../../../../components/live-spark/live-spark'
import { SsoRedirectService } from '../../../../../shared/services/sso-redirect.service'

interface MarketTicker {
  id: string
  name: string
  iconName: string
  decimals: number
  base: number // day-open reference
  price: number // live price
  pct: number // signed % vs base ("today's move")
}

@Component({
  selector: 'app-live-account-market',
  standalone: true,
  imports: [ExcentButton, ExcentPill, ExcentStaticIcon, LiveSpark, TranslateModule],
  templateUrl: './market.html',
  styleUrl: './market.scss',
})
export class LiveAccountMarket {
  private readonly platformId = inject(PLATFORM_ID)
  private readonly destroyRef = inject(DestroyRef)
  private readonly _sso = inject(SsoRedirectService)

  // Vertical slot (card height + gap) — must match the SCSS.
  protected readonly slot = 110

  // Decorative live "Top Movers" feed (mock). Values random-walk and the list
  // re-ranks by movement, so the biggest mover of the day floats to the top.
  protected readonly tickers = signal<MarketTicker[]>([
    { id: 'btc', name: 'Bitcoin', iconName: 'BTCUSD', decimals: 0, base: 70758, price: 70758, pct: 1.92 },
    { id: 'eth', name: 'Ethereum', iconName: 'ETHUSD', decimals: 0, base: 3975, price: 3975, pct: -0.62 },
    { id: 'sol', name: 'Solana', iconName: 'SOLUSD', decimals: 2, base: 176.38, price: 176.38, pct: 1.14 },
    { id: 'ada', name: 'Cardano', iconName: 'ADAUSD', decimals: 4, base: 0.4612, price: 0.4612, pct: 0.35 },
    { id: 'eur', name: 'Euro', iconName: 'EURUSD', decimals: 4, base: 1.0846, price: 1.0846, pct: -0.41 },
  ])

  // id → rank by movement (biggest |%| first). Drives the slide animation.
  protected readonly rankById = computed<Record<string, number>>(() => {
    const sorted = [...this.tickers()].sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct))
    const map: Record<string, number> = {}
    sorted.forEach((t, i) => (map[t.id] = i))
    return map
  })

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const timer = setInterval(() => this.step(), 1400)
      this.destroyRef.onDestroy(() => clearInterval(timer))
    }
  }

  protected cardTransform(id: string): string {
    return `translateY(${this.rankById()[id] * this.slot}px)`
  }

  protected formatPrice(t: MarketTicker): string {
    return t.price.toLocaleString('en-US', {
      minimumFractionDigits: t.decimals,
      maximumFractionDigits: t.decimals,
    })
  }

  protected pctLabel(t: MarketTicker): string {
    return `${Math.abs(t.pct).toFixed(2)}%`
  }

  protected onCreateAccount(): void {
    this._sso.goTo('sign-up')
  }

  protected onDemoAccount(): void {
    this._sso.goTo('sign-up')
  }

  // One mock tick: random-walk each % (reflecting at ±4.5%) and re-derive price.
  private step(): void {
    this.tickers.update(list =>
      list.map(t => {
        let pct = t.pct + (Math.random() - 0.5) * 0.7
        const cap = 4.5
        if (pct > cap) pct = cap - (pct - cap)
        if (pct < -cap) pct = -cap - (pct + cap)
        pct = Math.max(-cap, Math.min(cap, pct))
        return { ...t, pct, price: t.base * (1 + pct / 100) }
      }),
    )
  }
}
