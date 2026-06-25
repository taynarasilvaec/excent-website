import { isPlatformBrowser } from '@angular/common'
import { Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core'
import { ExcentCard } from '../../../../../components/excent-card/excent-card'
import { ExcentStaticIcon } from '../../../../../components/excent-static-icon/excent-static-icon'
import { ExcentText } from '../../../../../components/excent-text/excent-text'
import { PulseChart } from './pulse-chart/pulse-chart'

interface PulseAsset {
  id: string
  name: string
  ticker: string
  category: string
  iconName: string
  price: string
  basePrice: number
  change: string
  up: boolean
  spark: string
}

type ChartType = 'area' | 'candle'

@Component({
  selector: 'app-live-market-pulse',
  standalone: true,
  imports: [ExcentCard, ExcentText, ExcentStaticIcon, PulseChart],
  templateUrl: './market-pulse.html',
  styleUrl: './market-pulse.scss',
})
export class LiveMarketPulse {
  private readonly platformId = inject(PLATFORM_ID)
  private readonly destroyRef = inject(DestroyRef)

  protected readonly assets: PulseAsset[] = [
    { id: 'btc', name: 'Bitcoin', ticker: 'BTC', category: 'Crypto', iconName: 'BTCUSD', price: '70,758', basePrice: 70758, change: '+16.90%', up: true, spark: '0,18 10,15 20,16 30,10 40,12 50,7 60,9 70,3' },
    { id: 'nvda', name: 'NVIDIA', ticker: 'NVDA', category: 'NVDA', iconName: 'NVDA', price: '137.83', basePrice: 137.83, change: '+14.66%', up: true, spark: '0,16 10,11 20,13 30,8 40,12 50,6 60,9 70,4' },
    { id: 'eth', name: 'Ethereum', ticker: 'ETH', category: 'ETH', iconName: 'ETHUSD', price: '3,975', basePrice: 3975, change: '+24.40%', up: true, spark: '0,17 10,13 20,14 30,8 40,10 50,6 60,4 70,2' },
    { id: 'xau', name: 'Gold', ticker: 'XAU', category: 'XAU', iconName: 'XAUUSD', price: '2,345.26', basePrice: 2345.26, change: '+6.33%', up: true, spark: '0,13 10,15 20,9 30,12 40,8 50,11 60,6 70,8' },
    { id: 'sol', name: 'Solana', ticker: 'SOL', category: 'SOL', iconName: 'SOLUSD', price: '176.38', basePrice: 176.38, change: '+10.35%', up: true, spark: '0,11 10,14 20,8 30,13 40,9 50,7 60,12 70,6' },
    { id: 'eurusd', name: 'Euro / USD', ticker: 'EURU', category: 'EUR/USD', iconName: 'EURUSD', price: '1.1026', basePrice: 1.1026, change: '+3.16%', up: true, spark: '0,15 10,12 20,13 30,9 40,11 50,7 60,8 70,5' },
  ]

  protected readonly ranges = ['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y', 'MAX'] as const

  protected readonly selectedId = signal('btc')
  protected readonly chartType = signal<ChartType>('area')
  protected readonly range = signal<string>('1D')
  protected readonly clock = signal('--:--:--')

  protected readonly featured = computed(
    () => this.assets.find(a => a.id === this.selectedId()) ?? this.assets[0],
  )

  // OHLC strip + trade stats (mock, mirror the Markets Figma).
  protected readonly ohlc = computed(() => {
    const p = this.featured().price
    return [
      { label: 'Open', value: p },
      { label: 'High', value: p },
      { label: 'Low', value: p },
      { label: 'Close', value: p },
    ]
  })

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.updateClock()
      const timer = setInterval(() => this.updateClock(), 1000)
      this.destroyRef.onDestroy(() => clearInterval(timer))
    }
  }

  protected select(id: string): void {
    this.selectedId.set(id)
  }

  protected setType(type: ChartType): void {
    this.chartType.set(type)
  }

  protected setRange(r: string): void {
    this.range.set(r)
  }

  private updateClock(): void {
    const d = new Date()
    const p = (n: number): string => n.toString().padStart(2, '0')
    this.clock.set(`${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}`)
  }
}
