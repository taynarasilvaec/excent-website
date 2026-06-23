import { isPlatformBrowser } from '@angular/common'
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  PLATFORM_ID,
  computed,
  // effect,
  inject,
  signal,
} from '@angular/core'
// import { toSignal } from '@angular/core/rxjs-interop'
// import { ExcentServCatalogsService } from '@excent/excent-serv-catalogs'
// import type { ISymbolPriceWithVariation } from '@excent/excent-models'
// import { WebsocketService } from '@excent/excent-serv-websocket-prices'
import { TranslateModule } from '@ngx-translate/core'
// import { filter, map } from 'rxjs'
import { ExcentCard } from '../../../../components/excent-card/excent-card'
import { ExcentStaticIcon } from '../../../../components/excent-static-icon/excent-static-icon'
import { ExcentSymbolCard } from '../../../../components/excent-symbol-card/excent-symbol-card'
import { ExcentSymbolCardData } from '../../../../components/excent-symbol-card/excent-symbol-card.types'
import { ExcentText } from '../../../../components/excent-text/excent-text'
import { TopMover } from '../home.models'
import { CredibilityChart } from './credibility-chart/credibility-chart'

// const TOP_N = 4
// const STOCK_CATEGORY_NAMES = ['us-shares', 'us-stocks', 'stocks']

const MOCK_TOP_MOVERS_BASE: TopMover[] = [
  {
    iconName: 'AAPL',
    ticker: 'AAPL',
    iconType: 'symbol',
    iconShape: 'square',
    symbol: 'Apple',
    value: '$75.48',
    change: '-0.20 (-0.3)',
    trend: 'up',
    chartData: [68, 72, 70, 76, 73, 78, 74, 75.48],
  },
  {
    iconName: 'BTCUSD',
    ticker: 'BTCUSD',
    iconType: 'symbol',
    iconShape: 'round',
    symbol: 'Bitcoin',
    value: '29,500',
    change: '+150 (+0.51)',
    trend: 'up',
    chartData: [29200, 28900, 29100, 28800, 29250, 29050, 29400, 29500],
  },
  {
    iconName: 'XAGUSD',
    ticker: 'XAGUSD',
    iconType: 'symbol',
    iconShape: 'round',
    symbol: 'Silver',
    value: '15,800',
    change: '+50 (+0.32)',
    trend: 'up',
    chartData: [15500, 15700, 15600, 15850, 15720, 15900, 15770, 15800],
  },
  {
    iconName: 'XAUUSD',
    ticker: 'XAUUSD',
    iconType: 'symbol',
    iconShape: 'round',
    symbol: 'Gold',
    value: '14,000',
    change: '-100 (-0.71)',
    trend: 'down',
    chartData: [14250, 14100, 14180, 14000, 14130, 13950, 14080, 14000],
  },
]

const MOCK_TOP_MOVERS: TopMover[] = [
  ...MOCK_TOP_MOVERS_BASE,
  ...MOCK_TOP_MOVERS_BASE,
  ...MOCK_TOP_MOVERS_BASE.slice(0, 2),
]

@Component({
  selector: 'app-home-credibility',
  standalone: true,
  imports: [
    ExcentCard,
    ExcentStaticIcon,
    ExcentSymbolCard,
    ExcentText,
    CredibilityChart,
    TranslateModule,
  ],
  templateUrl: './credibility.html',
  styleUrl: './credibility.scss',
})
export class HomeCredibility implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID)
  private readonly destroyRef = inject(DestroyRef)
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef)
  // private readonly catalogService = inject(ExcentServCatalogsService)
  // private readonly wsService = inject(WebsocketService)

  protected readonly currentYear = new Date().getFullYear()
  protected readonly isMobile = signal<boolean>(
    isPlatformBrowser(this.platformId) ? window.innerWidth < 1024 : false
  )

  @HostListener('window:resize')
  protected onWindowResize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile.set(window.innerWidth < 1024)
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return

    // Dos observers por card con timings distintos:
    //   - .is-revealing (rootMargin -38%): se dispara cuando la card esta
    //     al ~85% del growth. Dispara las animaciones time-based del
    //     contenido en cards 3 y 4 para que empiecen a aparecer mientras
    //     el card todavia esta creciendo — asi el usuario no tiene que
    //     esperar a que el card termine.
    //   - .is-grown (rootMargin -60%): se dispara al final del growth,
    //     cuando el card ya esta en scale 1. Lockea el card en ese estado
    //     (el :not(.is-grown) del SCSS cancela la animacion scroll-linked
    //     y el card no se reverse al subir el scroll — efecto one-shot).
    // observer.disconnect() en cada uno asegura un solo trigger por card.
    const cards = Array.from(
      this.host.nativeElement.querySelectorAll<HTMLElement>('.credibility__card')
    )

    if (typeof IntersectionObserver === 'undefined') {
      for (const el of cards) {
        el.classList.add('is-revealing')
        el.classList.add('is-grown')
      }
      return
    }

    const observers: IntersectionObserver[] = []

    // Scale lock: aplica a las 4 cards.
    for (const el of cards) {
      const lockObserver = new IntersectionObserver(
        entries => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              el.classList.add('is-grown')
              lockObserver.disconnect()
            }
          }
        },
        { rootMargin: '0px 0px -60% 0px' }
      )
      lockObserver.observe(el)
      observers.push(lockObserver)
    }

    // Content reveal: solo cards 3 y 4 tienen contenido animado en stagger.
    const contentCards = cards.filter(
      el =>
        el.classList.contains('credibility__card--support') ||
        el.classList.contains('credibility__card--performers')
    )
    for (const el of contentCards) {
      const revealObserver = new IntersectionObserver(
        entries => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              el.classList.add('is-revealing')
              revealObserver.disconnect()
            }
          }
        },
        { rootMargin: '0px 0px -38% 0px' }
      )
      revealObserver.observe(el)
      observers.push(revealObserver)
    }

    this.destroyRef.onDestroy(() => {
      for (const obs of observers) obs.disconnect()
    })
  }

  // TODO: reactivar integración con backend cuando esté lista.
  // protected readonly topMovers = toSignal(
  //   this.catalogService.topMovers$.pipe(
  //     map(list => this.mapTopMovers(list)),
  //     map(mapped => (mapped.length > 0 ? mapped : MOCK_TOP_MOVERS)),
  //   ),
  //   { initialValue: MOCK_TOP_MOVERS },
  // )
  protected readonly topMovers = signal<TopMover[]>(MOCK_TOP_MOVERS)

  protected readonly selectedTicker = signal<string>(
    isPlatformBrowser(this.platformId) && window.innerWidth >= 1024
      ? MOCK_TOP_MOVERS[0]?.ticker ?? ''
      : ''
  )

  protected readonly closingTicker = signal<string | null>(null)

  protected readonly selectedSymbol = computed<TopMover>(() => {
    const ticker = this.selectedTicker()
    return this.topMovers().find(t => t.ticker === ticker) ?? this.topMovers()[0]
  })

  // protected readonly chartLiveTick = signal<LiveTick | null>(null)
  protected readonly chartLiveTick = signal<null>(null)

  protected readonly bestPerformers: ExcentSymbolCardData[] = [
    {
      iconName: 'BTC',
      iconType: 'symbol',
      iconShape: 'round',
      symbol: 'Bitcoin',
      category: 'crypto',
      change: '+48.6%',
      trend: 'up',
      chartData: [60, 65, 62, 70, 68, 75, 72, 80],
    },
    {
      iconName: 'XAGUSD',
      iconType: 'symbol',
      iconShape: 'round',
      symbol: 'Silver',
      category: 'commodities',
      change: '+28.6%',
      trend: 'up',
      chartData: [50, 52, 50, 55, 53, 58, 56, 60],
    },
    {
      iconName: 'ORCL',
      iconType: 'symbol',
      iconShape: 'square',
      symbol: 'Oracle',
      category: 'us-shares',
      change: '-23.52%',
      trend: 'down',
      chartData: [80, 75, 78, 72, 70, 65, 62, 58],
    },
    {
      iconName: 'WHEAT',
      iconType: 'symbol',
      iconShape: 'square',
      symbol: 'Wheat',
      category: 'commodities',
      change: '+13.41%',
      trend: 'up',
      chartData: [40, 42, 41, 45, 43, 47, 46, 50],
    },
    {
      iconName: 'AMZN',
      iconType: 'symbol',
      iconShape: 'square',
      symbol: 'Amazon',
      category: 'us-shares',
      change: '+33.1%',
      trend: 'up',
      chartData: [55, 58, 56, 62, 60, 66, 64, 70],
    },
  ]

  // constructor() {
  //   if (!isPlatformBrowser(this.platformId)) return
  //
  //   effect(onCleanup => {
  //     const ticker = this.selectedTicker()
  //     if (!ticker) return
  //     const sub = this.wsService
  //       .listen()
  //       .pipe(
  //         filter(msg => !!msg && (msg.symbol === ticker || msg.s === ticker || msg.SYM === ticker)),
  //       )
  //       .subscribe(msg => {
  //         const price = msg.ask ?? msg.a ?? msg.Ask ?? msg.price
  //         if (typeof price !== 'number') return
  //         this.chartLiveTick.set({
  //           price,
  //           timestamp: msg.timestamp ?? Date.now(),
  //         })
  //       })
  //     onCleanup(() => sub.unsubscribe())
  //   })
  // }

  protected onTopMoverClick(mover: TopMover): void {
    const current = this.selectedTicker()

    if (current === mover.ticker) {
      this.closingTicker.set(current)
      this.selectedTicker.set('')
    } else {
      if (current) this.closingTicker.set(current)
      if (this.closingTicker() === mover.ticker) this.closingTicker.set(null)
      this.selectedTicker.set(mover.ticker)
    }
    // this.chartLiveTick.set(null)
  }

  protected onChartAnimEnd(event: AnimationEvent, mover: TopMover): void {
    if (event.animationName.includes('collapse') && this.closingTicker() === mover.ticker) {
      this.closingTicker.set(null)
    }
  }

  protected isSelected(mover: TopMover): boolean {
    return this.selectedTicker() === mover.ticker
  }

  protected isClosing(mover: TopMover): boolean {
    return this.closingTicker() === mover.ticker
  }

  protected readonly sparklineWidth = 70
  protected readonly sparklineHeight = 23

  protected sparklinePoints(data: number[] | undefined): { x: number; y: number }[] {
    if (!data || data.length < 2) return []
    const w = this.sparklineWidth
    const h = this.sparklineHeight
    const padding = 2
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    const stepX = (w - padding * 2) / (data.length - 1)
    return data.map((v, i) => ({
      x: padding + i * stepX,
      y: padding + (h - padding * 2) * (1 - (v - min) / range),
    }))
  }

  protected sparklinePath(data: number[] | undefined): string {
    return this.smoothPath(this.sparklinePoints(data))
  }

  protected sparklineAreaPath(data: number[] | undefined): string {
    const points = this.sparklinePoints(data)
    if (points.length === 0) return ''
    const linePath = this.smoothPath(points)
    const lastX = points[points.length - 1].x
    const firstX = points[0].x
    return `${linePath} L${lastX.toFixed(2)} ${this.sparklineHeight} L${firstX.toFixed(2)} ${this.sparklineHeight} Z`
  }

  private smoothPath(points: { x: number; y: number }[]): string {
    if (points.length < 2) return ''
    if (points.length === 2) {
      return `M${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)} L${points[1].x.toFixed(2)} ${points[1].y.toFixed(2)}`
    }
    let path = `M${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] ?? points[i]
      const p1 = points[i]
      const p2 = points[i + 1]
      const p3 = points[i + 2] ?? points[i + 1]
      const cp1x = p1.x + (p2.x - p0.x) / 6
      const cp1y = p1.y + (p2.y - p0.y) / 6
      const cp2x = p2.x - (p3.x - p1.x) / 6
      const cp2y = p2.y - (p3.y - p1.y) / 6
      path += ` C${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
    }
    return path
  }

  // === Mapeo ISymbolPriceWithVariation → TopMover (comentado, requiere backend) ===

  // private mapTopMovers(list: ISymbolPriceWithVariation[]): TopMover[] {
  //   if (!Array.isArray(list) || list.length === 0) return []
  //
  //   return [...list]
  //     .filter(s => Number.isFinite(s.variation) && (s.name || s.displayName))
  //     .sort((a, b) => Math.abs(b.variation) - Math.abs(a.variation))
  //     .slice(0, TOP_N)
  //     .map(s => this.toTopMover(s))
  // }

  // private toTopMover(s: ISymbolPriceWithVariation): TopMover {
  //   const ticker = s.name ?? ''
  //   const display = s.displayName || s.description || ticker
  //   const category = s.symbolCategory?.name?.toLowerCase() ?? ''
  //   const isStock = STOCK_CATEGORY_NAMES.some(c => category.includes(c))
  //
  //   return {
  //     iconName: ticker,
  //     ticker,
  //     iconType: 'symbol',
  //     iconShape: isStock ? 'square' : 'round',
  //     symbol: display,
  //     value: this.formatPrice(s.ask),
  //     change: this.formatChange(s.variation, s.ask),
  //     trend: s.variation >= 0 ? 'up' : 'down',
  //   }
  // }

  // private formatPrice(value: number | undefined): string {
  //   if (typeof value !== 'number' || !Number.isFinite(value)) return '—'
  //   if (value >= 1000) return value.toLocaleString('en-US', { maximumFractionDigits: 0 })
  //   return value.toFixed(2)
  // }

  // private formatChange(variation: number, ask: number | undefined): string {
  //   const pct = variation.toFixed(2)
  //   const abs =
  //     typeof ask === 'number' && Number.isFinite(ask)
  //       ? ((ask * variation) / 100).toFixed(2)
  //       : '—'
  //   const sign = variation >= 0 ? '+' : ''
  //   return `${sign}${abs} (${sign}${pct}%)`
  // }
}
