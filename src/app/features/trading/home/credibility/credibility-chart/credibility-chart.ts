import { isPlatformBrowser } from '@angular/common'
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  computed,
  effect,
  inject,
  input,
} from '@angular/core'
import { ExcentStaticIcon } from '../../../../../components/excent-static-icon/excent-static-icon'
import {
  ExcentStaticIconShape,
  ExcentStaticIconType,
} from '../../../../../components/excent-static-icon/excent-static-icon.types'
import { ThemeService } from '../../../../../shared/services/theme.service'
import { KLineData, LiveTick } from '../../home.models'

@Component({
  selector: 'app-credibility-chart',
  standalone: true,
  imports: [ExcentStaticIcon],
  templateUrl: './credibility-chart.html',
  styleUrl: './credibility-chart.scss',
})
export class CredibilityChart implements AfterViewInit, OnDestroy {
  public symbol = input<string>('FTSE 100')
  public iconName = input<string>('FTSE')
  public iconShape = input<ExcentStaticIconShape>('round')
  public iconType = input<ExcentStaticIconType>('symbol')
  public trend = input<'up' | 'down' | 'flat'>('up')

  // Input opcional: cuando el padre conecte el WS, le pasa los ticks acá.
  public livePrice = input<LiveTick | null>(null)

  @ViewChild('chartContainer', { static: true })
  private chartContainer!: ElementRef<HTMLDivElement>

  private readonly platformId = inject(PLATFORM_ID)
  private readonly destroyRef = inject(DestroyRef)
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef)
  private readonly theme = inject(ThemeService)
  private chart: any = null
  private liveBarCallback: ((data: KLineData) => void) | null = null
  private resizeObserver: ResizeObserver | null = null
  private revealObserver: IntersectionObserver | null = null

  protected readonly chartId = `credibility-chart-${Math.random().toString(36).slice(2, 8)}`
  protected readonly currentPrice = computed(() => this.priceForSymbol(this.symbol()))
  protected readonly priceChange = computed(() => '-0.20')

  constructor() {
    // Cuando cambia el símbolo: avisar al chart que cambió el ticker.
    // klinecharts disparará getBars({ type: 'init', ... }) automáticamente.
    effect(() => {
      const sym = this.symbol()
      if (this.chart) {
        this.chart.setSymbol({
          ticker: sym,
          pricePrecision: 2,
          volumePrecision: 0,
        })
        this.applyRightEdgeClamp()
      }
    })

    // Cuando llega un tick en vivo: llamamos al callback que registramos
    // en subscribeBar. klinecharts actualiza la última vela visible.
    effect(() => {
      const tick = this.livePrice()
      if (tick && this.liveBarCallback) {
        this.liveBarCallback({
          timestamp: tick.timestamp,
          open: tick.price,
          high: tick.price,
          low: tick.price,
          close: tick.price,
        })
      }
    })

    // Re-style the chart when the theme flips (light removes the blue gradient).
    effect(() => {
      this.theme.isDark()
      if (this.chart) this.chart.setStyles(this.buildChartStyles())
    })

    this.destroyRef.onDestroy(() => this.cleanup())
  }

  /** klinecharts style config, theme-aware. Light mode drops the blue gradient
   *  fill (neutral tint) and uses dark axis labels. */
  private buildChartStyles(): any {
    const dark = this.theme.isDark()
    const lineColor = dark ? '#0062E8' : '#0062E8'
    const areaBg = dark
      ? [
          { offset: 0, color: 'rgba(0, 98, 232, 0)' },
          { offset: 1, color: 'rgba(0, 98, 232, 0.40)' },
        ]
      : [
          { offset: 0, color: 'rgba(17, 24, 39, 0)' },
          { offset: 1, color: 'rgba(17, 24, 39, 0.06)' },
        ]
    const axisColor = dark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(17, 24, 39, 0.55)'

    return {
      grid: { show: false },
      candle: {
        type: 'area',
        area: { lineSize: 2, lineColor, smooth: true, backgroundColor: areaBg },
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
        tickText: { color: axisColor, size: 12, family: 'Helvetica Neue' },
      },
      yAxis: {
        axisLine: { show: false },
        tickLine: { show: false },
        tickText: { color: axisColor, size: 12, family: 'Helvetica Neue' },
      },
      crosshair: { show: false },
    }
  }

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return

    const klinecharts = await import('klinecharts')

    this.chart = klinecharts.init(this.chartContainer.nativeElement, {
      timezone: 'UTC',
    })

    this.chart.setStyles(this.buildChartStyles())

    this.chart.setPeriod({ type: 'month', span: 1 })

    // Bloquear zoom: solo dejamos scroll horizontal (drag/wheel-horizontal)
    // para que el usuario pueda navegar el histórico pero no cambie la escala.
    this.chart.setZoomEnabled?.(false)

    // Loader de datos: klinecharts llama getBars cuando necesita histórico
    // (al cambiar de símbolo, al hacer scroll hacia atrás, etc).
    // subscribeBar/unsubscribeBar nos da control para inyectar ticks live.
    this.chart.setDataLoader({
      getBars: (params: any) => {
        const ticker = params.symbol?.ticker ?? this.symbol()
        if (params.type === 'init') {
          // TODO: reemplazar por llamada al backend al endpoint de histórico.
          const data = this.generateMockData(ticker)
          params.callback(data, false)
          // Re-aplicar el clamp después de cargar data: setSymbol y la carga
          // inicial resetean los offsets a los valores default de klinecharts.
          this.applyRightEdgeClamp()
          // Ajustar el ancho de cada bar para que toda la data llene el chart.
          // Ejecutamos varias veces con delays progresivos porque en mount
          // inicial el layout flex/CSS puede no estar 100% asentado todavia,
          // y necesitamos que klinecharts mida bien el contenedor para
          // calcular el barSpace correcto (sin esto, en pantallas grandes
          // las velas se acumulan a la derecha en vez de llenar el ancho).
          requestAnimationFrame(() => this.fitDataToWidth())
          setTimeout(() => this.fitDataToWidth(), 100)
          setTimeout(() => this.fitDataToWidth(), 350)
        } else if (params.type === 'backward') {
          // TODO: cargar más histórico paginado del backend cuando hay scroll
          // hacia atrás y se acaba la data cargada.
          params.callback([], false)
        } else {
          params.callback([], false)
        }
      },
      subscribeBar: (params: any) => {
        // TODO: cuando se conecte el WS público, suscribirse acá al símbolo:
        //   params.symbol.ticker
        // y cada tick llamar params.callback({ timestamp, open, high, low, close }).
        this.liveBarCallback = params.callback
      },
      unsubscribeBar: () => {
        this.liveBarCallback = null
      },
    })

    // Si el usuario intenta arrastrar hacia el "futuro", reseteamos el offset
    // a 0 para que el último dato quede siempre pegado al borde derecho.
    this.chart.subscribeAction('onScroll', () => {
      const offset = this.chart?.getOffsetRightDistance?.() ?? 0
      if (offset > 0) {
        this.chart.setOffsetRightDistance(0)
      }
    })

    // Setea el símbolo: dispara getBars({ type: 'init' }) automáticamente.
    this.chart.setSymbol({
      ticker: this.symbol(),
      pricePrecision: 2,
      volumePrecision: 0,
    })

    this.applyRightEdgeClamp()

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.fitDataToWidth())
      this.resizeObserver.observe(this.chartContainer.nativeElement)
    }

    // Dispara la animacion de dibujado del chart cuando entra al viewport.
    // Animacion con duracion fija (no scroll-linked) para que nunca quede a
    // medias por la posicion del scroll.
    const chartHost = this.elementRef.nativeElement
    const rect = chartHost.getBoundingClientRect()
    const inViewport = rect.top < window.innerHeight && rect.bottom > 0
    if (inViewport) {
      chartHost.classList.add('is-in-view')
    } else if (typeof IntersectionObserver !== 'undefined') {
      this.revealObserver = new IntersectionObserver(
        entries => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              chartHost.classList.add('is-in-view')
              this.revealObserver?.disconnect()
              this.revealObserver = null
              return
            }
          }
        },
        { threshold: 0.2 }
      )
      this.revealObserver.observe(chartHost)
    }

    const host = this.chartContainer.nativeElement
    host.addEventListener('wheel', this.onWheelCapture, { capture: true, passive: true })
    this.destroyRef.onDestroy(() => {
      host.removeEventListener('wheel', this.onWheelCapture, { capture: true })
    })
  }

  private readonly onWheelCapture = (event: WheelEvent): void => {
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.stopImmediatePropagation()
    }
  }

  private applyRightEdgeClamp(): void {
    if (!this.chart) return
    // Pegamos el último dato al borde derecho (sin espacio "del futuro")
    // y bloqueamos el pan hacia adelante.
    this.chart.setOffsetRightDistance(0)
    this.chart.setMaxOffsetRightDistance(0)
  }

  @HostListener('window:resize')
  protected onWindowResize(): void {
    this.fitDataToWidth()
  }

  private fitDataToWidth(): void {
    if (!this.chart) return
    // Forzar a klinecharts a recalcular el canvas interno cuando el contenedor
    // cambia de tamano (sin esto el canvas queda al tamano viejo al achicar la
    // ventana, lo que hace que la grafica se vea recortada).
    this.chart.resize?.()
    const data = this.chart.getDataList?.() ?? []
    if (data.length === 0) return
    const width = this.chartContainer.nativeElement.clientWidth
    if (!width) return
    // Reserva pequeña para el eje Y a la derecha (klinecharts usa ~30-50px)
    const usableWidth = Math.max(width - 50, 0)

    // Si el contenedor crecio mucho mas alla de lo que la data actual puede
    // llenar (e.g., el usuario arrastro la ventana de chica a grande), regeneramos
    // la data con mas puntos para que las velas mantengan barSpace ~28 y llenen el
    // ancho. Sin esto, las velas se acumulan a la derecha al expandir la pantalla.
    const targetBarSpace = 28
    const targetDataCount = Math.max(24, Math.ceil(usableWidth / targetBarSpace))
    if (targetDataCount > data.length * 1.3) {
      this.chart.resetData?.()
      return
    }

    // Dividir por (dataLength - 1) para que el primer bar quede pegado al borde izquierdo
    // y no quede ningún hueco al inicio.
    // Clamp a 50 porque es el max barSpace que acepta klinecharts (si pasamos
    // mas, lo rechaza silenciosamente y queda en el default de 10).
    const rawBarSpace = usableWidth / Math.max(data.length - 1, 1)
    const barSpace = Math.min(rawBarSpace, 50)
    if (barSpace > 0) {
      this.chart.setBarSpace(barSpace)
      // Re-aplicar el offset derecho después del cambio de barSpace para
      // asegurar que la data se renderice desde el borde izquierdo hasta el derecho.
      this.chart.setOffsetRightDistance(0)
      // Scroll all the way left para asegurar que se ve desde el primer dato.
      this.chart.scrollToDataIndex?.(data.length - 1, 0)
    }
  }

  ngOnDestroy(): void {
    this.cleanup()
  }

  private cleanup(): void {
    this.liveBarCallback = null
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }
    if (this.revealObserver) {
      this.revealObserver.disconnect()
      this.revealObserver = null
    }
    if (this.chart && isPlatformBrowser(this.platformId)) {
      import('klinecharts').then(klinecharts => {
        klinecharts.dispose(this.chartContainer.nativeElement)
      })
      this.chart = null
    }
  }

  private priceForSymbol(symbol: string): string {
    const map: Record<string, string> = {
      'FTSE 100': '$75.48',
      Apple: '$75.48',
      Bitcoin: '$29,500',
      Silver: '$15,800',
      Gold: '$14,000',
    }
    return map[symbol] ?? '$75.48'
  }

  private generateMockData(symbol: string): KLineData[] {
    // Calculamos cuantos meses generar segun el ancho del contenedor para que
    // las velas mantengan un barSpace razonable y la grafica llene el ancho.
    // klinecharts tiene un max barSpace de ~50px, asi que con pocas velas
    // en pantalla grande quedan acumuladas a la derecha. Mas data => velas
    // mas chicas => llena el espacio.
    const containerW = this.chartContainer?.nativeElement?.clientWidth ?? 800
    const targetBarSpace = 28
    const usableWidth = Math.max(containerW - 50, 200)
    const months = Math.max(24, Math.ceil(usableWidth / targetBarSpace))
    const seed = this.hashString(symbol)
    const base = 70 + (seed % 30)

    const data: KLineData[] = []
    const today = new Date()
    let prevClose = base

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const noise = (this.pseudoRandom(seed + i) - 0.5) * 6
      const trend = Math.sin((i + seed) / 4) * 4
      const close = Math.max(40, base + trend + noise)
      const open = prevClose
      const high = Math.max(open, close) + Math.abs(noise) * 0.5
      const low = Math.min(open, close) - Math.abs(noise) * 0.5
      data.push({
        timestamp: date.getTime(),
        open,
        high,
        low,
        close,
        volume: 1000,
      })
      prevClose = close
    }
    return data
  }

  private hashString(s: string): number {
    let h = 0
    for (let i = 0; i < s.length; i++) {
      h = (h * 31 + s.charCodeAt(i)) >>> 0
    }
    return h
  }

  private pseudoRandom(seed: number): number {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }
}
