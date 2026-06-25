import { afterNextRender, Component, DestroyRef, ElementRef, inject, input, viewChild } from '@angular/core'

let sparkSeq = 0

/**
 * Decorative LIVE sparkline — a bounded random walk that scrolls right→left via
 * requestAnimationFrame, so the chart is always moving. 1px non-scaling stroke +
 * an area fill that fades to dark blue at opacity 0 (per Figma 713-1231).
 * Mock data only; SSR-safe (animation starts after the first browser render).
 */
@Component({
  selector: 'live-spark',
  standalone: true,
  templateUrl: './live-spark.html',
  styleUrl: './live-spark.scss',
})
export class LiveSpark {
  private readonly _destroyRef = inject(DestroyRef)

  readonly up = input<boolean>(true)

  protected readonly gradId = `live-spark-grad-${sparkSeq++}`

  private readonly _line = viewChild.required<ElementRef<SVGPolylineElement>>('line')
  private readonly _area = viewChild.required<ElementRef<SVGPolygonElement>>('area')

  // viewBox geometry (stretched to the host via preserveAspectRatio="none").
  private readonly _w = 100
  private readonly _h = 48
  private readonly _count = 46
  private readonly _step = this._w / (this._count - 1)

  private _series: number[] = []
  private _offset = 0
  private _last = 0
  private _raf = 0

  constructor() {
    afterNextRender(() => {
      this._seed()
      this._last = performance.now()
      const loop = (now: number): void => {
        this._tick(now)
        this._raf = requestAnimationFrame(loop)
      }
      this._raf = requestAnimationFrame(loop)
      this._destroyRef.onDestroy(() => cancelAnimationFrame(this._raf))
    })
  }

  private _next(prev: number): number {
    const drift = this.up() ? -0.35 : 0.35
    let v = prev + (Math.random() - 0.5) * 5 + drift
    const min = 6
    const max = this._h - 6
    if (v < min) v = min + (min - v) * 0.6
    if (v > max) v = max - (v - max) * 0.6
    return Math.max(min, Math.min(max, v))
  }

  private _seed(): void {
    let v = this.up() ? this._h - 9 : 9
    this._series = [v]
    for (let i = 0; i < this._count; i++) {
      v = this._next(v)
      this._series.push(v)
    }
    this._render()
  }

  private _tick(now: number): void {
    const dt = Math.min(now - this._last, 100)
    this._last = now
    const tickMs = 650 // one new data point every 650ms
    this._offset += (this._step / tickMs) * dt
    while (this._offset >= this._step) {
      this._offset -= this._step
      this._series.shift()
      this._series.push(this._next(this._series[this._series.length - 1]))
    }
    this._render()
  }

  private _render(): void {
    const pts: string[] = []
    for (let i = 0; i < this._series.length; i++) {
      pts.push(`${(i * this._step - this._offset).toFixed(2)},${this._series[i].toFixed(2)}`)
    }
    const line = pts.join(' ')
    this._line().nativeElement.setAttribute('points', line)
    this._area().nativeElement.setAttribute('points', `${line} ${this._w},${this._h} 0,${this._h}`)
  }
}
