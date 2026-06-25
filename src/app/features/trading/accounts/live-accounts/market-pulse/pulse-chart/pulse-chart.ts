import { isPlatformBrowser } from '@angular/common'
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  effect,
  inject,
  input,
} from '@angular/core'
import { ThemeService } from '../../../../../../shared/services/theme.service'

interface Bar {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
}

/**
 * Self-animating market chart (klinecharts). Generates fake OHLC data and pushes
 * a new tick every ~1s so the line keeps moving. Supports an area ↔ candle toggle
 * and is theme-aware (blue line per the Markets Figma).
 */
@Component({
  selector: 'app-pulse-chart',
  standalone: true,
  templateUrl: './pulse-chart.html',
  styleUrl: './pulse-chart.scss',
})
export class PulseChart implements AfterViewInit, OnDestroy {
  public readonly ticker = input<string>('BTC')
  public readonly basePrice = input<number>(70000)
  public readonly chartType = input<'area' | 'candle'>('area')

  @ViewChild('chartContainer', { static: true })
  private chartContainer!: ElementRef<HTMLDivElement>

  private readonly platformId = inject(PLATFORM_ID)
  private readonly destroyRef = inject(DestroyRef)
  private readonly theme = inject(ThemeService)

  private chart: any = null
  private liveBarCallback: ((bar: Bar) => void) | null = null
  private last: Bar | null = null
  private tick = 0
  private timer: ReturnType<typeof setInterval> | null = null

  constructor() {
    // Re-style on theme or chart-type change.
    effect(() => {
      this.theme.isDark()
      this.chartType()
      if (this.chart) this.chart.setStyles(this.buildStyles())
    })
    // Re-seed data when the selected asset changes.
    effect(() => {
      this.ticker()
      this.basePrice()
      if (this.chart) {
        this.tick = 0
        this.chart.setSymbol({ ticker: this.ticker(), pricePrecision: 2, volumePrecision: 0 })
        this.applyClamp()
      }
    })
    this.destroyRef.onDestroy(() => this.cleanup())
  }

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return
    const klinecharts = await import('klinecharts')

    this.chart = klinecharts.init(this.chartContainer.nativeElement, { timezone: 'UTC' })
    this.chart.setStyles(this.buildStyles())
    this.chart.setPeriod({ type: 'minute', span: 1 })
    this.chart.setZoomEnabled?.(false)

    this.chart.setDataLoader({
      getBars: (params: any) => {
        if (params.type === 'init') {
          const data = this.genData()
          this.last = data[data.length - 1]
          params.callback(data, false)
          requestAnimationFrame(() => this.fit())
          setTimeout(() => this.fit(), 120)
          setTimeout(() => this.fit(), 360)
        } else {
          params.callback([], false)
        }
      },
      subscribeBar: (params: any) => {
        this.liveBarCallback = params.callback
      },
      unsubscribeBar: () => {
        this.liveBarCallback = null
      },
    })

    this.chart.subscribeAction?.('onScroll', () => {
      if ((this.chart?.getOffsetRightDistance?.() ?? 0) > 0) this.chart.setOffsetRightDistance(0)
    })

    this.chart.setSymbol({ ticker: this.ticker(), pricePrecision: 2, volumePrecision: 0 })
    this.applyClamp()
    this.startAnimation()

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => this.fit())
      ro.observe(this.chartContainer.nativeElement)
      this.destroyRef.onDestroy(() => ro.disconnect())
    }
  }

  private startAnimation(): void {
    // Push a fake tick ~1s: random-walk the last bar's close, rolling to a new
    // bar every 8 ticks so the chart visibly advances.
    this.timer = setInterval(() => {
      if (!this.last || !this.liveBarCallback) return
      const base = this.basePrice()
      const drift = (Math.random() - 0.5) * base * 0.004
      const close = Math.max(this.last.close + drift, base * 0.4)
      this.tick++
      if (this.tick % 8 === 0) {
        this.last = {
          timestamp: this.last.timestamp + 60_000,
          open: this.last.close,
          high: Math.max(this.last.close, close),
          low: Math.min(this.last.close, close),
          close,
        }
      } else {
        this.last = {
          ...this.last,
          close,
          high: Math.max(this.last.high, close),
          low: Math.min(this.last.low, close),
        }
      }
      this.liveBarCallback(this.last)
    }, 1000)
    this.destroyRef.onDestroy(() => {
      if (this.timer) clearInterval(this.timer)
    })
  }

  private genData(): Bar[] {
    const base = this.basePrice()
    const now = Date.now()
    const count = 80
    const step = 60_000
    let price = base * (0.96 + Math.random() * 0.02)
    const out: Bar[] = []
    for (let i = 0; i < count; i++) {
      const open = price
      const change = (Math.random() - 0.48) * base * 0.006
      const close = Math.max(open + change, base * 0.4)
      const high = Math.max(open, close) + Math.random() * base * 0.003
      const low = Math.min(open, close) - Math.random() * base * 0.003
      out.push({ timestamp: now - (count - i) * step, open, high, low, close })
      price = close
    }
    return out
  }

  private buildStyles(): any {
    const dark = this.theme.isDark()
    const isArea = this.chartType() === 'area'
    const line = '#0062E8'
    const up = dark ? '#22c55e' : '#15803d'
    const down = dark ? '#ef4444' : '#dc2626'
    const axis = dark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(17, 24, 39, 0.50)'
    const gridColor = dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(17, 24, 39, 0.06)'
    const areaBg = dark
      ? [
          { offset: 0, color: 'rgba(0, 98, 232, 0)' },
          { offset: 1, color: 'rgba(0, 98, 232, 0.40)' },
        ]
      : [
          { offset: 0, color: 'rgba(0, 98, 232, 0)' },
          { offset: 1, color: 'rgba(0, 98, 232, 0.14)' },
        ]

    return {
      grid: {
        show: true,
        horizontal: { show: true, color: gridColor, style: 'dashed', size: 1 },
        vertical: { show: false },
      },
      candle: {
        type: isArea ? 'area' : 'candle_solid',
        area: { lineSize: 2, lineColor: line, smooth: true, backgroundColor: areaBg },
        bar: {
          upColor: up,
          downColor: down,
          noChangeColor: axis,
          upBorderColor: up,
          downBorderColor: down,
          noChangeBorderColor: axis,
          upWickColor: up,
          downWickColor: down,
          noChangeWickColor: axis,
        },
        tooltip: { show: false, showRule: 'none' },
        priceMark: {
          show: true,
          last: { show: true, line: { show: false }, text: { show: false } },
          high: { show: false },
          low: { show: false },
        },
      },
      xAxis: {
        axisLine: { show: false },
        tickLine: { show: false },
        tickText: { color: axis, size: 11, family: 'Helvetica Neue' },
      },
      yAxis: {
        axisLine: { show: false },
        tickLine: { show: false },
        tickText: { color: axis, size: 11, family: 'Helvetica Neue' },
      },
      crosshair: {
        show: true,
        horizontal: {
          show: true,
          line: { show: true, style: 'dashed', size: 1, color: axis },
          text: {
            show: true,
            color: '#ffffff',
            size: 11,
            family: 'Helvetica Neue',
            backgroundColor: dark ? 'rgba(20, 25, 30, 0.92)' : 'rgba(17, 24, 39, 0.92)',
            borderRadius: 4,
            paddingLeft: 6,
            paddingRight: 6,
            paddingTop: 3,
            paddingBottom: 3,
          },
        },
        vertical: {
          show: true,
          line: { show: true, style: 'solid', size: 1, color: dark ? 'rgba(255, 255, 255, 0.55)' : 'rgba(17, 24, 39, 0.45)' },
          text: {
            show: true,
            color: '#ffffff',
            size: 11,
            family: 'Helvetica Neue',
            backgroundColor: dark ? 'rgba(20, 25, 30, 0.92)' : 'rgba(17, 24, 39, 0.92)',
            borderRadius: 4,
            paddingLeft: 6,
            paddingRight: 6,
            paddingTop: 3,
            paddingBottom: 3,
          },
        },
      },
    }
  }

  private applyClamp(): void {
    if (!this.chart) return
    this.chart.setOffsetRightDistance(0)
    this.chart.setMaxOffsetRightDistance(0)
  }

  private fit(): void {
    if (!this.chart) return
    this.chart.resize?.()
    const data = this.chart.getDataList?.() ?? []
    if (!data.length) return
    const width = this.chartContainer.nativeElement.clientWidth
    if (!width) return
    const barSpace = Math.min((width - 50) / Math.max(data.length - 1, 1), 50)
    if (barSpace > 0) {
      this.chart.setBarSpace(barSpace)
      this.chart.setOffsetRightDistance(0)
      this.chart.scrollToDataIndex?.(data.length - 1, 0)
    }
  }

  ngOnDestroy(): void {
    this.cleanup()
  }

  private cleanup(): void {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    this.liveBarCallback = null
    if (this.chart && isPlatformBrowser(this.platformId)) {
      import('klinecharts').then(kc => kc.dispose(this.chartContainer.nativeElement))
      this.chart = null
    }
  }
}
